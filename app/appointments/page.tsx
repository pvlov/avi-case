"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useMedicalStore } from "@/lib/store";

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
import { useRouter } from "next/navigation";
import { Section } from "@/components/section";

interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  datetime: string; // ISO string
  location: string;
  status: "upcoming" | "completed" | "cancelled";
}

export default function AppointmentsPage() {
  // Get sign-in state from store
  const router = useRouter();
  const isSignedIn = useMedicalStore((state) => state.isSignedIn);
  // TODO: replace with real flag from your store/context
  const [onboardingCompleted] = useState(false);

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Redirect to home if not signed in
  useEffect(() => {
    if (!isSignedIn) {
      router.push("/");
    }
  }, [isSignedIn, router]);

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

  // If not signed in, show a message briefly before redirect
  if (!isSignedIn) {
    return (
      <Section className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to access your appointments.</CardDescription>
          </CardHeader>
        </Card>
      </Section>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <h1 className="text-2xl font-semibold">My Appointments</h1>

      {isSignedIn && !onboardingCompleted && (
        <Card className="border-avi-green bg-avi-green/10 flex items-center justify-between gap-4 border-l-4 p-4">
          <p className="m-0 font-medium">Please complete your onboarding to access appointments.</p>
          <Link href="/onboarding">
            <Button variant="outline" size="sm">
              Go to Onboarding
            </Button>
          </Link>
        </Card>
      )}

      <Card className="p-4">
        <h2 className="mb-4 text-lg font-medium">Upcoming Appointments</h2>

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
                    <TableCell>{format(dt, "PPpp")}</TableCell>
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
