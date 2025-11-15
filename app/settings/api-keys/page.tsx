"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Copy, Trash2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

type ApiKey = {
  id: string
  name: string
  key: string
  created: string
  expirationDate: string
  status: "active" | "revoked"
}

const initialApiKeys: ApiKey[] = [
  {
    id: "1",
    name: "Production API Key",
    key: "sk_live_abc123def456ghi789jkl012mno345pqr678",
    created: "2024-01-15",
    expirationDate: "Never",
    status: "active",
  },
  {
    id: "2",
    name: "Development API Key",
    key: "sk_test_xyz987uvw654rst321opq098lmn765ijk432",
    created: "2024-02-01",
    expirationDate: "2024-05-01",
    status: "active",
  },
]

export default function ApiKeysPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialApiKeys)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isSaveKeyDialogOpen, setIsSaveKeyDialogOpen] = useState(false)
  const [newKeyName, setNewKeyName] = useState("")
  const [expireDate, setExpireDate] = useState("never")
  const [generatedKey, setGeneratedKey] = useState("")
  const [confirmSaved, setConfirmSaved] = useState(false)
  const [copiedNewKey, setCopiedNewKey] = useState(false)

  const handleGenerateKey = () => {
    // Generate API key
    const key = `sk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`
    setGeneratedKey(key)
    setIsCreateDialogOpen(false)
    setIsSaveKeyDialogOpen(true)
  }

  const handleSaveKey = () => {
    if (!confirmSaved) return
    
    // Calculate expiration date
    let expirationDateStr = "Never"
    if (expireDate !== "never") {
      const days = parseInt(expireDate)
      const expirationDate = new Date()
      expirationDate.setDate(expirationDate.getDate() + days)
      expirationDateStr = expirationDate.toISOString().split("T")[0]
    }
    
    const newKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: generatedKey,
      created: new Date().toISOString().split("T")[0],
      expirationDate: expirationDateStr,
      status: "active" as const,
    }
    setApiKeys([...apiKeys, newKey])
    
    // Reset state
    setIsSaveKeyDialogOpen(false)
    setNewKeyName("")
    setExpireDate("never")
    setGeneratedKey("")
    setConfirmSaved(false)
    setCopiedNewKey(false)
  }

  const handleCancelCreate = () => {
    setIsCreateDialogOpen(false)
    setNewKeyName("")
    setExpireDate("never")
  }

  const handleCloseSave = () => {
    if (confirmSaved) {
      handleSaveKey()
    }
  }

  const handleCopyNewKey = () => {
    navigator.clipboard.writeText(generatedKey)
    setCopiedNewKey(true)
    setTimeout(() => setCopiedNewKey(false), 2000)
  }

  const handleDeleteKey = (id: string) => {
    setApiKeys(apiKeys.filter((key) => key.id !== id))
  }

  const maskApiKey = (key: string) => {
    if (key.length <= 12) return key
    const start = key.substring(0, 12)
    const end = key.substring(key.length - 4)
    return `${start}...${end}`
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-1.5">
              <CardTitle>Your API Keys</CardTitle>
              <CardDescription>
                Manage your API keys for accessing the platform programmatically.
              </CardDescription>
            </div>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              New API Key
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>API Key</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Expiration Date</TableHead>
                <TableHead className="w-[100px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((apiKey) => (
                <TableRow key={apiKey.id}>
                  <TableCell className="font-medium">{apiKey.name}</TableCell>
                  <TableCell>
                    <code className="text-xs bg-secondary px-2 py-1 rounded font-mono">
                      {maskApiKey(apiKey.key)}
                    </code>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {apiKey.created}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {apiKey.expirationDate}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteKey(apiKey.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create API Key Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New API Key</DialogTitle>
            <DialogDescription>
              Give your API key a descriptive name and set an expiration date.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="key-name">API Key Name</Label>
              <Input
                id="key-name"
                placeholder="e.g. Production Key, Development Key"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expire-date">Expire Date</Label>
              <Select value={expireDate} onValueChange={setExpireDate}>
                <SelectTrigger id="expire-date">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="never">Never</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCancelCreate}>
              Cancel
            </Button>
            <Button onClick={handleGenerateKey} disabled={!newKeyName.trim()}>
              Generate API Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Save API Key Dialog */}
      <Dialog open={isSaveKeyDialogOpen} onOpenChange={setIsSaveKeyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Your API Key</DialogTitle>
            <DialogDescription>
              Make sure to copy your API key now. You won't be able to see it again!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Your API Key</Label>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-secondary px-3 py-2 rounded font-mono break-all">
                  {generatedKey}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyNewKey}
                  className="shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              {copiedNewKey && (
                <p className="text-xs text-green-600">Copied to clipboard!</p>
              )}
            </div>

            <Separator />

            <div className="flex items-center space-x-2">
              <Checkbox
                id="confirm-saved"
                checked={confirmSaved}
                onCheckedChange={(checked) => setConfirmSaved(checked as boolean)}
              />
              <label
                htmlFor="confirm-saved"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I understand that I will only see this key once and I have saved it
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleCloseSave} disabled={!confirmSaved}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

