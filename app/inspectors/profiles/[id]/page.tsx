"use client"

import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Avatar, 
  Chip, 
  Divider, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow,
  Skeleton
} from "@mui/material"
import { User, Award, History, Briefcase } from "lucide-react"
import useSWR from "swr"
import { useParams } from "next/navigation"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function InspectorProfilePage() {
  const { id } = useParams()
  const { data: profile, isLoading } = useSWR(`/api/inspectors/profiles/${id}`, fetcher)

  if (isLoading) return (
    <Box sx={{ p: 4 }}>
      <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 3 }} />
    </Box>
  )

  return (
    <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh' }}>
      <Grid container spacing={4}>
        {/* Левая колонка: Визитная карточка */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
            <Avatar 
              sx={{ 
                width: 140, 
                height: 140, 
                mx: 'auto', 
                mb: 3, 
                bgcolor: 'primary.dark',
                fontSize: '3rem',
                fontWeight: 'bold',
                boxShadow: '0 0 0 8px #f1f5f9'
              }}
            >
              {profile?.users?.fullname?.[0]}
            </Avatar>
            
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>{profile?.users?.fullname}</Typography>
            <Typography variant="button" color="primary" sx={{ display: 'block', mb: 3, fontWeight: 'bold' }}>
              {profile?.users?.rank}
            </Typography>
            
            <Divider sx={{ mb: 3 }} />
            
            <Box sx={{ textAlign: 'left', mb: 4 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Briefcase size={14} /> ТЕКУЩАЯ ДОЛЖНОСТЬ
                </Typography>
                <Typography sx={{ fontWeight: 600 }}>{profile?.users?.position}</Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Award size={14} /> СПЕЦИАЛИЗАЦИЯ
                </Typography>
                <Typography sx={{ fontWeight: 600 }}>{profile?.specialization || "Инспектор-ревизор"}</Typography>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  УРОВЕНЬ ДОПУСКА
                </Typography>
                <Chip 
                  label={profile?.clearance_level || "ОБЩИЙ"} 
                  color="info" 
                  size="small" 
                  sx={{ fontWeight: 'bold' }} 
                />
              </Box>
            </Box>

            <Box sx={{ p: 2, bgcolor: '#f1f5f9', borderRadius: 2 }}>
                <Typography variant="h4" color="primary" sx={{ fontWeight: 900 }}>
                   {profile?.total_audits} 
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 'bold' }}>ЗАВЕРШЕННЫХ РЕВИЗИЙ</Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Правая колонка: Аналитика ротаций */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid #e2e8f0' }}>
            <Typography variant="h6" sx={{ mb: 4, display: 'flex', alignItems: 'center', fontWeight: 800 }}>
              <History size={24} style={{ marginRight: 12, color: '#1e293b' }} />
              ТРАЕКТОРИЯ ПРОХОЖДЕНИЯ СЛУЖБЫ
            </Typography>
            
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f8fafc' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Период службы</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Подразделение / Орган КРР</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Должность</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Приказ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {profile?.inspector_rotations?.map((r: any) => (
                  <TableRow key={r.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {new Date(r.start_date).toLocaleDateString('ru-RU')} — {r.end_date ? new Date(r.end_date).toLocaleDateString('ru-RU') : 'н.в.'}
                    </TableCell>
                    <TableCell>{r.ref_units?.name?.ru}</TableCell>
                    <TableCell>
                      <Chip label={r.position} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                        {r.order_number}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {!profile?.inspector_rotations?.length && (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">История ротаций отсутствует</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
