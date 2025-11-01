"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, File, Trash2, Share2 } from "lucide-react"
import { Card } from "@/components/ui/card"

interface SharedFile {
  id: string
  name: string
  type: string
  size: string
  uploadedAt: string
  sharedWith: string[]
}

export default function FileSharing() {
  const [files, setFiles] = useState<SharedFile[]>([
    {
      id: "1",
      name: "Cardiac_Report_2024.pdf",
      type: "PDF",
      size: "2.4 MB",
      uploadedAt: "2024-11-03",
      sharedWith: ["Amina Belhadj", "Dr. Mohamed Khadra"],
    },
    {
      id: "2",
      name: "ECG_Results.pdf",
      type: "PDF",
      size: "1.8 MB",
      uploadedAt: "2024-11-02",
      sharedWith: ["Youssef Menai"],
    },
    {
      id: "3",
      name: "Blood_Test_Analysis.xlsx",
      type: "Excel",
      size: "456 KB",
      uploadedAt: "2024-11-01",
      sharedWith: ["Fatima Zahra"],
    },
  ])
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])

  const handleShare = () => {
    if (selectedFiles.length > 0) {
      alert(`Files shared: ${selectedFiles.join(", ")}`)
      setSelectedFiles([])
    }
  }

  const handleDelete = (id: string) => {
    setFiles(files.filter((f) => f.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="p-6 border-2 border-dashed border-primary/30 hover:border-primary/60 transition-colors">
        <div className="text-center py-8 space-y-4">
          <Upload className="w-10 h-10 text-primary mx-auto" />
          <div>
            <p className="font-medium text-foreground">Drag and drop files or click to upload</p>
            <p className="text-sm text-muted-foreground">Supported: PDF, XLSX, DOCX, JPG, PNG (Max 10 MB)</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">Select Files</Button>
        </div>
      </Card>

      {/* Shared Files */}
      <div>
        <h3 className="font-bold text-foreground mb-4">Recent Shared Files</h3>
        <div className="space-y-3">
          {files.map((file) => (
            <div key={file.id} className="p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <File className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-medium text-foreground">{file.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {file.size} • {file.uploadedAt}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {file.sharedWith.map((person) => (
                        <span
                          key={person}
                          className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                        >
                          {person}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => alert(`Sharing options for ${file.name}`)}
                    className="p-2 hover:bg-primary/10 text-primary rounded transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="p-2 hover:bg-destructive/10 text-destructive rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Share with Patient */}
      <Card className="p-6 bg-primary/5 border-primary/30">
        <h3 className="font-bold text-foreground mb-4">Share Files with Patient</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Select Patient</label>
            <select className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option>Select a patient...</option>
              <option>Amina Belhadj</option>
              <option>Youssef Menai</option>
              <option>Fatima Zahra</option>
              <option>Mohammed Kouris</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Select Files</label>
            <div className="space-y-2">
              {files.map((file) => (
                <label key={file.id} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(file.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedFiles([...selectedFiles, file.id])
                      } else {
                        setSelectedFiles(selectedFiles.filter((id) => id !== file.id))
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm text-foreground">{file.name}</span>
                </label>
              ))}
            </div>
          </div>
          <Button onClick={handleShare} className="w-full bg-primary hover:bg-primary/90">
            Share Selected Files
          </Button>
        </div>
      </Card>
    </div>
  )
}
