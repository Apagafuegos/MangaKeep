'use client'

import { importVolumes } from '@/app/actions/import'
import { Upload } from 'lucide-react'
import Papa from 'papaparse'
import { useState } from 'react'

export function CsvImporter() {
    const [file, setFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<Record<string, unknown>[]>([])
    const [isImporting, setIsImporting] = useState(false)
    const [result, setResult] = useState<{ success: number, failed: number, errors: string[] } | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            setFile(selectedFile)
            Papa.parse(selectedFile, {
                header: true,
                preview: 5,
                skipEmptyLines: true,
                complete: (results) => {
                    setPreview(results.data as Record<string, unknown>[])
                    setResult(null)
                }
            })
        }
    }

    const handleImport = async () => {
        if (!file) return

        setIsImporting(true)
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                try {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const res = await importVolumes(results.data as Record<string, any>[])
                    setResult(res)
                    setFile(null)
                    setPreview([])
                } catch {
                    alert('Import failed completely')
                } finally {
                    setIsImporting(false)
                }
            }
        })
    }

    return (
        <div className="bg-card w-full max-w-xl mx-auto p-6 rounded-lg border shadow-sm">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Upload size={24} />
                Bulk Import
            </h2>

            <p className="text-sm text-muted-foreground mb-4">
                Upload a CSV with headers: <code>Title</code>, <code>Volume</code>, <code>Author</code>, <code>ISBN</code>.
            </p>

            {!result && (
                <div className="space-y-4">
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    />

                    {preview.length > 0 && (
                        <div className="border rounded bg-muted/20 p-2 text-xs overflow-x-auto">
                            <h4 className="font-semibold mb-2">Preview (First 5 rows)</h4>
                            <table className="w-full text-left">
                                <thead>
                                    <tr>
                                        {Object.keys(preview[0]).slice(0, 4).map(h => (
                                            <th key={h} className="p-1 border-b">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {preview.map((row, i) => (
                                        <tr key={i}>
                                            {Object.values(row).slice(0, 4).map((c: unknown, j) => (
                                                <td key={j} className="p-1 border-b opacity-80">{String(c)}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="flex justify-end">
                        <button
                            onClick={handleImport}
                            disabled={!file || isImporting}
                            className="bg-primary text-primary-foreground px-4 py-2 rounded font-medium disabled:opacity-50"
                        >
                            {isImporting ? 'Importing...' : 'Import All'}
                        </button>
                    </div>
                </div>
            )}

            {result && (
                <div className="space-y-4 animate-in fade-in">
                    <div className="p-4 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded">
                        <p className="font-semibold">Import Complete!</p>
                        <p>Successfully imported: {result.success} volumes.</p>
                    </div>

                    {result.failed > 0 && (
                        <div className="p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded text-sm max-h-40 overflow-y-auto">
                            <p className="font-semibold">{result.failed} Failed:</p>
                            <ul className="list-disc list-inside">
                                {result.errors.map((e, i) => (
                                    <li key={i}>{e}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <button
                        onClick={() => setResult(null)}
                        className="text-sm underline"
                    >
                        Import more
                    </button>
                </div>
            )}
        </div>
    )
}
