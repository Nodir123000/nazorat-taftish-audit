"use client"

import { useState } from "react"
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  Paper, 
  Chip,
  IconButton,
  Alert
} from "@mui/material"
import { Save, Languages, Search, CheckCircle2 } from "lucide-react"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function LocalizationAdmin() {
  const { data: keys, isLoading, mutate } = useSWR("/api/i18n/management", fetcher)
  const [editing, setEditing] = useState<any>(null)
  const [success, setSuccess] = useState(false)

  const handleSave = async (key: string, locale: string, value: string) => {
    try {
      const res = await fetch("/api/i18n/management", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, locale, value })
      })
      if (res.ok) {
        setSuccess(true)
        setTimeout(() => setSuccess(false), 3000)
        mutate()
      }
    } catch (err) {
      console.error("Failed to save translation", err)
    }
  }

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            <Languages size={32} style={{ marginRight: 16, verticalAlign: 'bottom' }} />
            ЛИНГВИСТИЧЕСКИЙ РЕДАКТОР (ПС-9)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Централизованное управление терминами и переводами АИС КРР
          </Typography>
        </Box>
        {success && (
          <Alert icon={<CheckCircle2 size={18} />} severity="success" variant="filled">
            Изменения применены ко всей системе
          </Alert>
        )}
      </Box>

      <Table component={Paper} elevation={0} sx={{ border: '1px solid #eee' }}>
        <TableHead sx={{ bgcolor: '#f5f5f5' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Ключ системы (System ID)</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Русский язык (RU)</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>O'zbek tili (Latn)</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>O'zbek tili (Cyrl)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {keys?.map((k: any) => (
            <TableRow key={k.id} hover>
              <TableCell>
                <code style={{ color: '#d32f2f', fontWeight: 'bold' }}>{k.key}</code>
              </TableCell>
              <TableCell>
                <TextField 
                  fullWidth
                  size="small"
                  variant="standard"
                  defaultValue={k.i18n_values.find((v: any) => v.locale === "ru")?.value}
                  onBlur={(e) => handleSave(k.key, "ru", e.target.value)}
                />
              </TableCell>
              <TableCell>
                 <TextField 
                  fullWidth
                  size="small"
                  variant="standard"
                  defaultValue={k.i18n_values.find((v: any) => v.locale === "uzLatn")?.value}
                  onBlur={(e) => handleSave(k.key, "uzLatn", e.target.value)}
                />
              </TableCell>
              <TableCell>
                 <TextField 
                  fullWidth
                  size="small"
                  variant="standard"
                  defaultValue={k.i18n_values.find((v: any) => v.locale === "uzCyrl")?.value}
                  onBlur={(e) => handleSave(k.key, "uzCyrl", e.target.value)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
}
