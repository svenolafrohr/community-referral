"use client"

import { type FormEvent, useState } from "react"
import { CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function SuccessNotice({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-6 text-center">
      <CheckCircle2 className="size-10 text-foreground" />
      <p className="text-base font-medium text-foreground">{text}</p>
    </div>
  )
}

function LoginForm() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return <SuccessNotice text="Angemeldet" />
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="login-email">E-Mail</Label>
        <Input
          id="login-email"
          type="email"
          placeholder="name@beispiel.de"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="login-password">Passwort</Label>
          <a
            href="#"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Passwort vergessen?
          </a>
        </div>
        <Input id="login-password" type="password" placeholder="••••••••" required />
      </div>

      <Button type="submit" className="mt-2 h-11 w-full rounded-xl">
        Anmelden
      </Button>
    </form>
  )
}

function SignupForm() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return <SuccessNotice text="Konto erstellt" />
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="signup-name">Name</Label>
        <Input id="signup-name" placeholder="Vor- und Nachname" required />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="signup-email">E-Mail</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="name@beispiel.de"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="signup-password">Passwort</Label>
        <Input
          id="signup-password"
          type="password"
          placeholder="••••••••"
          required
          minLength={8}
        />
      </div>

      <Button type="submit" className="mt-2 h-11 w-full rounded-xl">
        Konto erstellen
      </Button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <span className="mb-8 text-sm font-semibold tracking-tight text-foreground">
        HiddenChamp
      </span>

      <div className="w-full max-w-sm rounded-[28px] bg-card p-8 shadow-[0_8px_16px_rgba(0,0,0,0.03),0_40px_80px_-32px_rgba(0,0,0,0.16)] ring-1 ring-black/[0.04]">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Willkommen bei HiddenChamp
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Melde dich an oder erstelle ein Konto, um Positionen zu empfehlen.
          </p>
        </div>

        <Tabs defaultValue="login">
          <TabsList className="mb-6 grid w-full grid-cols-2">
            <TabsTrigger value="login">Anmelden</TabsTrigger>
            <TabsTrigger value="signup">Registrieren</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          <TabsContent value="signup">
            <SignupForm />
          </TabsContent>
        </Tabs>
      </div>

      <p className="mt-6 max-w-sm text-center text-xs text-muted-foreground">
        Mit der Anmeldung stimmst du unseren Nutzungsbedingungen und der
        Datenschutzerklärung zu.
      </p>
    </div>
  )
}
