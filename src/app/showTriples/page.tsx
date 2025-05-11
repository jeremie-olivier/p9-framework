'use client'

import { useGetTriplesQuery } from '@0xintuition/graphql'
import { Card } from '@/components/ui/card'
import { question } from '@/data/question'

interface TripleAtom {
    id: number
    label: string
}

interface Triple {
    id: number
    subject: TripleAtom
    predicate: TripleAtom
    object: TripleAtom
}

export default function ShowTriplesPage() {
    // Create an array of queries for each question's triple
    const tripleQueries = question.map(q => {
        const { data, isLoading, error } = useGetTriplesQuery({
            where: {
                subject: { id: { _eq: q.triple.subject.id } },
                predicate: { id: { _eq: q.triple.predicate.id } },
                object: { id: { _eq: q.triple.object.id } }
            }
        })
        return { data, isLoading, error }
    })

    // Check if any query is still loading
    const isLoading = tripleQueries.some(q => q.isLoading)

    // Check if any query has an error
    const error = tripleQueries.find(q => q.error)?.error

    if (isLoading) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Loading Triples...</h1>
            </div>
        )
    }

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Error Loading Triples</h1>
                <p className="text-red-500">{error instanceof Error ? error.message : 'Unknown error'}</p>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Created Triples</h1>
            <div className="grid gap-4">
                {question.map((q, index) => {
                    const tripleData = tripleQueries[index].data?.triples[0] // Get the first matching triple
                    if (!tripleData) return null

                    return (
                        <Card key={q.id} className="p-4">
                            <div className="flex flex-col gap-2">
                                <h3 className="font-medium mb-2">{q.question}</h3>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">Subject:</span>
                                    <span>{q.triple.subject.label}</span>
                                    <span className="text-sm text-gray-500">(ID: {q.triple.subject.id})</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">Predicate:</span>
                                    <span>{q.triple.predicate.label}</span>
                                    <span className="text-sm text-gray-500">(ID: {q.triple.predicate.id})</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">Object:</span>
                                    <span>{q.triple.object.label}</span>
                                    <span className="text-sm text-gray-500">(ID: {q.triple.object.id})</span>
                                </div>
                                {tripleData.id && (
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">Triple ID:</span>
                                        <span>{tripleData.id}</span>
                                    </div>
                                )}
                            </div>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
} 