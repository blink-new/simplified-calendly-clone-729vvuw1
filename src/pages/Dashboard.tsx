import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, Users, Plus, Copy, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { useToast } from '../hooks/use-toast'

interface DashboardProps {
  user: any
}

export default function Dashboard({ user }: DashboardProps) {
  const { toast } = useToast()
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0
  })

  const bookingUrl = `${window.location.origin}/book/${user?.id}`

  const copyBookingLink = () => {
    navigator.clipboard.writeText(bookingUrl)
    toast({
      title: "Link copied!",
      description: "Your booking link has been copied to clipboard.",
    })
  }

  const openBookingPage = () => {
    window.open(bookingUrl, '_blank')
  }

  // Mock data for now - will be replaced with real data later
  const recentAppointments = [
    {
      id: '1',
      guestName: 'John Doe',
      guestEmail: 'john@example.com',
      title: '30 min Meeting',
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      status: 'confirmed'
    },
    {
      id: '2',
      guestName: 'Jane Smith',
      guestEmail: 'jane@example.com',
      title: '30 min Meeting',
      startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
      status: 'confirmed'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your scheduling activity.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={copyBookingLink} variant="outline" size="sm">
            <Copy className="w-4 h-4 mr-2" />
            Copy Link
          </Button>
          <Button onClick={openBookingPage} variant="outline" size="sm">
            <ExternalLink className="w-4 h-4 mr-2" />
            View Page
          </Button>
        </div>
      </div>

      {/* Booking Link Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Your Booking Link
          </CardTitle>
          <CardDescription>
            Share this link with others so they can book appointments with you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 p-3 bg-background rounded-lg border">
            <code className="flex-1 text-sm text-muted-foreground truncate">
              {bookingUrl}
            </code>
            <Button onClick={copyBookingLink} size="sm" variant="ghost">
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAppointments}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingAppointments}</div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedAppointments}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your calendar and settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start">
              <Link to="/availability">
                <Clock className="w-4 h-4 mr-2" />
                Set Availability
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/appointments">
                <Calendar className="w-4 h-4 mr-2" />
                View Appointments
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Appointments</CardTitle>
            <CardDescription>Your latest scheduled meetings</CardDescription>
          </CardHeader>
          <CardContent>
            {recentAppointments.length > 0 ? (
              <div className="space-y-3">
                {recentAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{appointment.guestName}</p>
                      <p className="text-xs text-muted-foreground">{appointment.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {appointment.startTime.toLocaleDateString()} at{' '}
                        {appointment.startTime.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                    <Badge variant="secondary">{appointment.status}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No appointments yet</p>
                <p className="text-xs text-muted-foreground">
                  Share your booking link to get started
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}