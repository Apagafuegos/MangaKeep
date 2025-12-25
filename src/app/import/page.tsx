import { CsvImporter } from '@/components/import/csv-importer'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ImportPage() {
    return (
        <div className="min-h-screen bg-background text-foreground p-8">
            <div className="max-w-4xl mx-auto">
                <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
                    <ArrowLeft size={16} className="mr-2" />
                    Back to Dashboard
                </Link>

                <h1 className="text-3xl font-bold mb-2">Import Collection</h1>
                <p className="text-muted-foreground mb-8">Migrate your existing manga list from CSV.</p>

                <CsvImporter />
            </div>
        </div>
    )
}
