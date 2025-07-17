import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Calendar, Clock, User, Mail, MessageSquare, ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Textarea } from '../components/ui/textarea'
import { Badge } from '../components/ui/badge'
import { useToast } from '../hooks/use-toast'
import { publicBlink } from '../blink/client'

export default function PublicBooking() {
  const { userId } = useParams()
  const { toast } = useToast()
  
  const [step, setStep] = useState<'select-time' | 'enter-details' | 'confirmation'>('select-time')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [guestDetails, setGuestDetails] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [calendarOwner, setCalendarOwner] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Load calendar owner information
  useEffect(() => {
    const loadOwnerInfo = async () => {
      try {
        // For now, we'll use mock data since we need to implement user profiles
        // In a real app, you'd fetch this from the database using the userId
        setCalendarOwner({
          id: userId,
          name: 'John Smith',
          email: 'john@example.com',
          meetingDuration: 30
        })
      } catch (error) {
        console.error('Failed to load owner info:', error)
        toast({
          title: "Error",
          description: "Failed to load calendar information.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      loadOwnerInfo()
    }
  }, [userId, toast])

  // Generate available dates (next 30 days, excluding weekends for demo)
  const getAvailableDates = () => {
    const dates = []
    const today = new Date()
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      
      // Skip weekends for demo
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date)
      }
    }
    
    return dates
  }

  // Generate available time slots for selected date
  const getAvailableTimeSlots = () => {
    if (!selectedDate) return []
    
    const slots = []
    const startHour = 9 // 9 AM
    const endHour = 17 // 5 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        const displayTime = new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })
        slots.push({ value: timeString, label: displayTime })
      }
    }
    
    return slots
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setSelectedTime(null)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleNextStep = () => {
    if (step === 'select-time' && selectedDate && selectedTime) {
      setStep('enter-details')
    } else if (step === 'enter-details' && guestDetails.name && guestDetails.email) {
      handleBookAppointment()
    }
  }

  const handleBookAppointment = async () => {
    try {
      if (!selectedDate || !selectedTime || !calendarOwner) return

      // Create the appointment date/time
      const [hours, minutes] = selectedTime.split(':')
      const appointmentDateTime = new Date(selectedDate)
      appointmentDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0)

      // Create appointment object
      const appointment = {
        id: `apt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        calendarOwnerId: calendarOwner.id,
        guestName: guestDetails.name,
        guestEmail: guestDetails.email,
        guestMessage: guestDetails.message || null,
        appointmentDate: appointmentDateTime.toISOString(),
        duration: calendarOwner.meetingDuration,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      }

      // For now, save to localStorage (in production, this would go to database)
      const existingAppointments = JSON.parse(localStorage.getItem('appointments') || '[]')
      existingAppointments.push(appointment)
      localStorage.setItem('appointments', JSON.stringify(existingAppointments))

      setStep('confirmation')
      toast({
        title: "Appointment booked!",
        description: "You'll receive a confirmation email shortly.",
      })
    } catch (error) {
      console.error('Failed to book appointment:', error)
      toast({
        title: "Error",
        description: "Failed to book appointment. Please try again.",
        variant: "destructive"
      })
    }
  }

  const formatSelectedDateTime = () => {
    if (!selectedDate || !selectedTime) return ''
    
    const [hours, minutes] = selectedTime.split(':')
    const dateTime = new Date(selectedDate)
    dateTime.setHours(parseInt(hours), parseInt(minutes))
    
    return dateTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading calendar...</p>
        </div>
      </div>
    )
  }

  if (!calendarOwner) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-foreground mb-4">Calendar Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The calendar you're looking for doesn't exist or is no longer available.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white/95 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">{calendarOwner.name}</h1>
              <p className="text-sm text-muted-foreground">
                {calendarOwner.meetingDuration} min meeting
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {step === 'select-time' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Date Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Select a Date
                </CardTitle>
                <CardDescription>
                  Choose an available date for your meeting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
                  {getAvailableDates().map((date) => (
                    <Button
                      key={date.toISOString()}
                      variant={selectedDate?.toDateString() === date.toDateString() ? "default" : "outline"}
                      className="justify-start h-auto p-3"
                      onClick={() => handleDateSelect(date)}
                    >
                      <div className="text-left">
                        <div className="font-medium">
                          {date.toLocaleDateString('en-US', { 
                            weekday: 'long',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {date.toLocaleDateString()}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Time Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Select a Time
                </CardTitle>
                <CardDescription>
                  {selectedDate 
                    ? `Available times for ${selectedDate.toLocaleDateString()}`
                    : 'Please select a date first'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedDate ? (
                  <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                    {getAvailableTimeSlots().map((slot) => (
                      <Button
                        key={slot.value}
                        variant={selectedTime === slot.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleTimeSelect(slot.value)}
                      >
                        {slot.label}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Select a date to see available times</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {step === 'enter-details' && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Enter Your Details
              </CardTitle>
              <CardDescription>
                Please provide your information to complete the booking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Selected Time Summary */}
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="font-medium">Selected Time</span>
                </div>
                <p className="text-sm">{formatSelectedDateTime()}</p>
                <p className="text-xs text-muted-foreground">
                  {calendarOwner.meetingDuration} minutes with {calendarOwner.name}
                </p>
              </div>

              {/* Guest Details Form */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={guestDetails.name}
                      onChange={(e) => setGuestDetails(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={guestDetails.email}
                      onChange={(e) => setGuestDetails(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Textarea
                    id="message"
                    value={guestDetails.message}
                    onChange={(e) => setGuestDetails(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Add any additional information or questions..."
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 'confirmation' && (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold mb-4">Appointment Confirmed!</h2>
              
              <div className="space-y-4 text-left max-w-md mx-auto">
                <div className="p-4 bg-muted rounded-lg">
                  <h3 className="font-semibold mb-3">Meeting Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{formatSelectedDateTime()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{calendarOwner.meetingDuration} minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>with {calendarOwner.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{guestDetails.email}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-muted-foreground mt-6">
                A confirmation email has been sent to {guestDetails.email}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        {step !== 'confirmation' && (
          <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              onClick={() => setStep('select-time')}
              disabled={step === 'select-time'}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="flex items-center gap-2">
              <Badge variant={step === 'select-time' ? 'default' : 'secondary'}>1</Badge>
              <div className="w-8 h-px bg-border"></div>
              <Badge variant={step === 'enter-details' ? 'default' : 'secondary'}>2</Badge>
            </div>

            <Button
              onClick={handleNextStep}
              disabled={
                (step === 'select-time' && (!selectedDate || !selectedTime)) ||
                (step === 'enter-details' && (!guestDetails.name || !guestDetails.email))
              }
            >
              {step === 'select-time' ? 'Continue' : 'Book Appointment'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}