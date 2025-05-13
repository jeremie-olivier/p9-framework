"use client";

import React from 'react';
import { useAccount } from 'wagmi';
import { useGetTriplesWithPositionsQuery, GetTriplesWithPositionsQuery } from '@0xintuition/graphql';
import { questions } from '../assessment/components/questions';

// Extract all triple IDs from questions
const allTripleIds = questions.map(q => q.triple.id);

export default function TriplesPage() {
    const { address } = useAccount();

    // Fetch positions for all triples
    const { data: positionsData, isLoading, error } = useGetTriplesWithPositionsQuery({
        where: {
            id: { _in: allTripleIds }
        },
        address: address?.toLowerCase() as `0x${string}`
    });

    if (!address) {
        return (
            <div className="p-4 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">My Triple Positions</h1>
                <p className="text-gray-600">Please connect your wallet to view your positions.</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="p-4 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">My Triple Positions</h1>
                <p className="text-gray-600">Loading positions...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">My Triple Positions</h1>
                <p className="text-red-600">Error loading positions: {error.toString()}</p>
            </div>
        );
    }

    const triples = positionsData?.triples || [];
    const total = positionsData?.total.aggregate?.count || 0;

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">My Triple Positions</h1>
            <p className="text-sm text-gray-600 mb-6">Total positions: {total}</p>

            {triples.length === 0 ? (
                <p className="text-gray-600">You don't have any positions yet.</p>
            ) : (
                <div className="flex flex-wrap gap-2">
                    {triples.map((triple: NonNullable<GetTriplesWithPositionsQuery['triples']>[number]) => {
                        // Find the corresponding question for this triple
                        const question = questions.find(q => q.triple.id === parseInt(triple.id));
                        const vaultPosition = triple.vault?.positions[0];
                        const counterVaultPosition = triple.counter_vault?.positions[0];

                        return (
                            <div
                                key={triple.id}
                                className="p-3 border rounded-lg shadow-sm hover:shadow-md transition-shadow min-w-[250px] flex-1 basis-[250px]"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-base">
                                            {question?.text || `Triple #${triple.id}`}
                                        </h3>
                                        <div className="mt-1 text-xs text-gray-600">
                                            <p>Subject: {triple.subject.label}</p>
                                            <p>Predicate: {triple.predicate.label}</p>
                                            <p>Object: {triple.object.label}</p>
                                        </div>
                                    </div>
                                    <div className="text-right ml-3">
                                        {vaultPosition && (
                                            <div className="mb-1">
                                                <p className="text-xs font-medium text-green-600">
                                                    For: {vaultPosition.shares} shares
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {((vaultPosition.shares / triple.vault?.total_shares) * 100).toFixed(1)}% of total
                                                </p>
                                            </div>
                                        )}
                                        {counterVaultPosition && (
                                            <div>
                                                <p className="text-xs font-medium text-red-600">
                                                    Against: {counterVaultPosition.shares} shares
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {((counterVaultPosition.shares / triple.counter_vault?.total_shares) * 100).toFixed(1)}% of total
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
} 