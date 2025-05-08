// components/SaveBanner.tsx
"use client";

import { useSession, signIn } from "next-auth/react";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { computeProfile } from "@/lib/scoring";

const STORAGE_ANS = "p9_answers";
const STORAGE_IDX = "p9_currentIndex";
const STORAGE_TEST = "p9_testId";

export function SaveBanner() {
  const { data: session, status } = useSession();
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [blockchainReady, setBlockchainReady] = useState(false);
  const [identityType, setIdentityType] = useState<"web2" | "web3" | "anonymous">("web2");

  // Determine identity type based on session
  const hasWeb2Identity = !!session?.user?.email;
  // Check for ethAddress in a type-safe way
  const hasWeb3Identity = !!session?.user && 'ethAddress' in session.user && !!session.user.ethAddress;
  const isAnonymous = !hasWeb2Identity && !hasWeb3Identity;

  // Handle anonymous save
  const handleAnonymousSave = useCallback(async () => {
    setIdentityType("anonymous");
    await handleSave("anonymous");
  }, []);

  // Handle Web3 save - this would connect to your wallet logic
  const handleWeb3Save = useCallback(async () => {
    try {
      // This is a placeholder for your web3 wallet connection
      // You would implement wallet connection logic here
      const ethAddress = "0x123"; // This would come from your wallet connection
      
      setIdentityType("web3");
      await handleSave("web3", undefined, ethAddress);
    } catch (error) {
      console.error("Web3 connection error:", error);
      toast.error("Failed to connect wallet");
    }
  }, []);

  // Main save handler with identity type support
  const handleSave = useCallback(async (
    type: "web2" | "web3" | "anonymous" = "web2", 
    email?: string, 
    ethAddress?: string
  ) => {
    if (saving || done) return;
    setSaving(true);

    try {
      // 1) Grab or generate testId
      let testId = sessionStorage.getItem(STORAGE_TEST);
      if (!testId) {
        testId = nanoid();
        sessionStorage.setItem(STORAGE_TEST, testId);
      }

      // 2) Load answers & compute primary archetype
      const raw = sessionStorage.getItem(STORAGE_ANS) || "{}";
      const answers = JSON.parse(raw) as Record<string, number>;
      const prof = computeProfile(answers);
      if (!prof.length) throw new Error("No completed test to save.");

      // Use email from session if web2 and not provided
      if (type === "web2" && !email && session?.user?.email) {
        email = session.user.email;
      }

      // 3) POST to your endpoint
      const res = await fetch("/api/save-results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testId,
          email,
          ethAddress,
          archetype: prof[0].slug,
          answers,
          identityType: type,
        }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || res.statusText);

      // 4) Save definitive answers for blockchain integration
      if (payload.definiteAnswers && Object.keys(payload.definiteAnswers).length > 0) {
        // Store the blockchain-ready answers in sessionStorage for future use
        sessionStorage.setItem('p9_blockchain_answers', JSON.stringify(payload.definiteAnswers));
        setBlockchainReady(true);
        console.log('Definitive answers ready for blockchain:', payload.definiteAnswers);
        
        // TODO: Add your blockchain integration here
        // This could be a call to push these answers on-chain as intuition triples
        // await sendToBlockchain(payload.definiteAnswers);
      }

      // 5) Notify & clear storage on first-time save
      if (payload.alreadySaved) {
        toast("Already saved!");
      } else {
        toast.success(`Results saved as ${type} user! Definitive answers prepared for blockchain.`);
        sessionStorage.removeItem(STORAGE_ANS);
        sessionStorage.removeItem(STORAGE_IDX);
        sessionStorage.removeItem(STORAGE_TEST);
      }

      setDone(true);
    } catch (err: any) {
      console.error("SaveBanner error:", err);
      toast.error(err.message || "Couldn't save your results");
    } finally {
      setSaving(false);
    }
  }, [saving, done, session]);

  const handleBlockchainSave = useCallback(async () => {
    try {
      toast("Coming soon: Blockchain storage for your intuition triples!");
      // This is where you would implement the actual blockchain storage
      // const blockchainAnswers = JSON.parse(sessionStorage.getItem('p9_blockchain_answers') || '{}');
      // await yourBlockchainStorageFunction(blockchainAnswers);
    } catch (err: any) {
      console.error("Blockchain storage error:", err);
      toast.error(err.message || "Couldn't save to blockchain");
    }
  }, []);

  // If loading, show nothing
  if (status === "loading") return null;

  // Render different options based on authentication state
  return (
    <div className="flex flex-col gap-2">
      {/* Web2 Sign In (if not signed in) */}
      {!hasWeb2Identity && !done && (
        <button
          onClick={() => signIn(undefined, { callbackUrl: window.location.href })}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Sign in with Email
        </button>
      )}

      {/* Web3 Connect (placeholder) */}
      {!hasWeb3Identity && !done && (
        <button
          onClick={handleWeb3Save}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Connect Wallet
        </button>
      )}

      {/* Anonymous Save */}
      {!done && (
        <button
          onClick={handleAnonymousSave}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Save Anonymously
        </button>
      )}

      {/* Web2 Save (if signed in) */}
      {hasWeb2Identity && !done && (
        <button
          onClick={() => handleSave("web2")}
          disabled={saving}
          className={`
            px-4 py-2 rounded text-white transition
            ${saving ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}
          `}
        >
          {saving ? "Saving…" : "Save with Email"}
        </button>
      )}

      {/* Already Saved State */}
      {done && (
        <div className="px-4 py-2 rounded bg-gray-400 text-white text-center">
          Saved as {identityType} user ✓
        </div>
      )}
      
      {/* Blockchain Storage Button */}
      {blockchainReady && (
        <button
          onClick={handleBlockchainSave}
          className="px-4 py-2 rounded bg-orange-500 hover:bg-orange-600 text-white transition"
        >
          Store on Blockchain
        </button>
      )}
    </div>
  );
}
