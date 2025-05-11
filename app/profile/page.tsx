// app/profile/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { format } from "date-fns";

interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  datetime: string; // ISO string
  location: string;
  status: "upcoming" | "completed" | "cancelled";
}

export default function ProfilePage() {
  // TODO: replace with real flag from your store/context
  const [onboardingCompleted] = useState(false);

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    // TODO: replace with real fetch from your MedicalStoreProvider or API
    const example: Appointment[] = [
      {
        id: "1",
        doctor: "Dr. Anna Müller",
        specialty: "Dermatology",
        datetime: "2025-05-20T14:30:00Z",
        location: "Clinic A, Room 12",
        status: "upcoming",
      },
      {
        id: "2",
        doctor: "Dr. Jonas Becker",
        specialty: "Cardiology",
        datetime: "2025-06-03T09:00:00Z",
        location: "Clinic B, Floor 3",
        status: "upcoming",
      },
    ];
    setAppointments(example);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">My Profile</h1>

      {!onboardingCompleted && (
        <Card className="flex items-center justify-between gap-4 border-l-4 border-avi-green bg-avi-green/10 p-4">
          <p className="m-0 font-medium">Please complete your onboarding to access appointments.</p>
          <Link href="/onboarding">
            <Button variant="outline" size="sm">Go to Onboarding</Button>
          </Link>
        </Card>
      )}

      <Card className="p-4">
        <h2 className="text-lg font-medium mb-4">Upcoming Appointments</h2>

        {appointments.length === 0 ? (
          <p className="text-muted-foreground">No upcoming appointments.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appt) => {
                const dt = new Date(appt.datetime);
                return (
                  <TableRow key={appt.id}>
                    <TableCell>
                      {format(dt, "PPpp")}
                    </TableCell>
                    <TableCell>{appt.doctor}</TableCell>
                    <TableCell>{appt.specialty}</TableCell>
                    <TableCell>{appt.location}</TableCell>
                    <TableCell>
                      <Badge variant={appt.status === "upcoming" ? "outline" : "secondary"}>
                        {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}