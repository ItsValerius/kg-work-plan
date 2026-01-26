"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, Calendar, ClipboardList, Clock, UserCheck, AlertCircle, AlertTriangle, Target, Timer, CheckCircle2 } from "lucide-react";

interface StatisticsCardsProps {
  totalParticipants: number;
  totalEvents: number;
  totalTasks: number;
  totalShifts: number;
  upcomingEvents: number;
  participantsWithTasks: number;
  tasksLackingParticipants: number;
  tasksWithNoParticipants: number;
  totalRequiredParticipants: number;
  overallParticipationRate: number;
  tasksStartingSoon: number;
  fullyStaffedTasks: number;
}

export function StatisticsCards({
  totalParticipants,
  totalEvents,
  totalTasks,
  totalShifts,
  upcomingEvents,
  participantsWithTasks,
  tasksLackingParticipants,
  tasksWithNoParticipants,
  totalRequiredParticipants,
  overallParticipationRate,
  tasksStartingSoon,
  fullyStaffedTasks,
}: StatisticsCardsProps) {
  // Base metrics - simple counts
  const baseStats = [
    {
      title: "Gesamt Teilnehmer",
      value: totalParticipants,
      icon: Users,
      description: "Registrierte Teilnehmer",
    },
    {
      title: "Veranstaltungen",
      value: totalEvents,
      icon: Calendar,
      description: `${upcomingEvents} bevorstehend`,
    },
    {
      title: "Aufgaben",
      value: totalTasks,
      icon: ClipboardList,
      description: "Gesamt Aufgaben",
    },
    {
      title: "Schichten",
      value: totalShifts,
      icon: Clock,
      description: "Gesamt Schichten",
    },
  ];

  // Calculated metrics - derived/computed values
  const calculatedStats = [
    {
      title: "Teilnehmer mit Aufgaben",
      value: participantsWithTasks,
      icon: UserCheck,
      description: "Teilnehmer mit Aufgaben",
      showProgress: true,
      progressValue: totalParticipants > 0 ? (participantsWithTasks / totalParticipants) * 100 : 0,
      progressLabel: totalParticipants > 0 ? `${Math.round((participantsWithTasks / totalParticipants) * 100)}% der Teilnehmer` : "Keine Teilnehmer",
    },
    {
      title: "Gesamt benötigt",
      value: totalRequiredParticipants,
      icon: Target,
      description: "Benötigte Teilnehmer gesamt",
      showProgress: true,
      progressValue: totalRequiredParticipants > 0 ? (totalParticipants / totalRequiredParticipants) * 100 : 0,
      progressLabel: `${Math.round(overallParticipationRate)}% abgedeckt`,
    },
    {
      title: "Aufgaben benötigen Teilnehmer",
      value: tasksLackingParticipants,
      icon: AlertCircle,
      description: "Aufgaben mit fehlenden Teilnehmern",
      isAlert: true,
      showProgress: true,
      progressValue: totalTasks > 0 ? ((totalTasks - tasksLackingParticipants) / totalTasks) * 100 : 0,
      progressLabel: `${Math.round(((totalTasks - tasksLackingParticipants) / totalTasks) * 100)}% der Aufgaben vollständig`,
    },
    {
      title: "Aufgaben ohne Teilnehmer",
      value: tasksWithNoParticipants,
      icon: AlertTriangle,
      description: "Aufgaben ohne Teilnehmer",
      isAlert: true,
      showProgress: false,
    },
    {
      title: "Aufgaben starten bald",
      value: tasksStartingSoon,
      icon: Timer,
      description: "Aufgaben in den nächsten 48 Stunden",
      showProgress: false,
    },
    {
      title: "Vollständig besetzte Aufgaben",
      value: fullyStaffedTasks,
      icon: CheckCircle2,
      description: "Aufgaben mit ausreichend Teilnehmern",
      showProgress: true,
      progressValue: totalTasks > 0 ? (fullyStaffedTasks / totalTasks) * 100 : 0,
      progressLabel: totalTasks > 0 ? `${Math.round((fullyStaffedTasks / totalTasks) * 100)}% aller Aufgaben` : "Keine Aufgaben",
    },
  ];

  const StatCard = ({ stat }: { stat: typeof baseStats[0] | typeof calculatedStats[0] }) => {
    const Icon = stat.icon;
    const isAlertCard = "isAlert" in stat && stat.isAlert && stat.value > 0;
    const showProgress = "showProgress" in stat && stat.showProgress;

    return (
      <Card
        className={`${isAlertCard ? "border-destructive border-2" : ""} ${"showProgress" in stat ? "bg-muted/30" : ""}`}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4 sm:px-6 sm:pt-6">
          <CardTitle className="text-xs sm:text-sm font-medium leading-tight">
            {stat.title}
          </CardTitle>
          <Icon className={`size-4 shrink-0 ${isAlertCard ? "text-destructive" : "text-muted-foreground"}`} />
        </CardHeader>
        <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
          <div className={`text-xl sm:text-2xl font-bold ${isAlertCard ? "text-destructive" : ""}`}>
            {stat.value}
          </div>
          {showProgress && "progressValue" in stat && "progressLabel" in stat ? (
            <div className="mt-2">
              <Progress
                value={stat.progressValue}
                className="h-2"
              />
              <p className="text-xs text-muted-foreground mt-1 leading-tight">
                {stat.progressLabel}
              </p>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground mt-1 leading-tight">
              {stat.description}
            </p>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Base Metrics Section */}
      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-3 text-muted-foreground">Basis-Statistiken</h3>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {baseStats.map((stat) => (
            <StatCard key={stat.title} stat={stat} />
          ))}
        </div>
      </div>

      {/* Calculated Metrics Section */}
      <div>
        <h3 className="text-base sm:text-lg font-semibold mb-3 text-muted-foreground">Berechnete Metriken</h3>
        <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {calculatedStats.map((stat) => (
            <StatCard key={stat.title} stat={stat} />
          ))}
        </div>
      </div>
    </div>
  );
}

