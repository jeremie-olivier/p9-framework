import { useCallback, useEffect, useState } from "react";
import type { Hex } from "viem";
import { useAccount, useConnect, usePublicClient, useSignMessage } from "wagmi";
import { SiweMessage } from "siwe";
import { cbWalletConnector } from "@/lib/wagmiConfig"
import { Button } from "./ui/Button";

export function ConnectAndSIWE() {
    const { connect } = useConnect({
        mutation: {
            onSuccess: (data) => {
                const address = data.accounts[0];
                const m = new SiweMessage({
                    domain: document.location.host,
                    address,
                    chainId: 84532,
                    uri: document.location.origin,
                    version: "1",
                    statement: "Smart Wallet SIWE Example",
                    nonce: "12345678",
                });
                setMessage(m);
                signMessage({ message: m.prepareMessage() });
            },
        },
    });
    const account = useAccount();
    const client = usePublicClient();
    const [signature, setSignature] = useState<Hex | undefined>(undefined);
    const { signMessage } = useSignMessage({
        mutation: { onSuccess: (sig) => setSignature(sig) },
    });
    const [message, setMessage] = useState<SiweMessage | undefined>(undefined);
    const [valid, setValid] = useState<boolean | undefined>(undefined);
    console.log(valid);

    const checkValid = useCallback(async () => {
        if (!signature || !account.address || !client || !message) return;

        client
            .verifyMessage({
                address: account.address,
                message: message.prepareMessage(),
                signature,
            })
            .then((v) => setValid(v));
    }, [signature, account, client, message]);

    useEffect(() => {
        checkValid();
    }, [signature, account, checkValid]);

    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    return (
        <Button
            onClick={() => connect({ connector: cbWalletConnector })}
            className="w-full justify-center"
        >
            {account.address ? formatAddress(account.address) : "Connect with Wallet"}
        </Button>
    );
}