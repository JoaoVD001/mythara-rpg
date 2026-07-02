"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Check, X, Loader2, AtSign } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const schema = z.object({
  name:     z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  username: z
    .string()
    .min(3, "Mínimo 3 caracteres")
    .max(20, "Máximo 20 caracteres")
    .regex(/^[a-z0-9_]+$/, "Apenas letras minúsculas, números e _"),
  email:    z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
})

type FormData = z.infer<typeof schema>
type UsernameStatus = "idle" | "checking" | "available" | "taken" | "invalid"

export default function RegisterPage() {
  const router  = useRouter()
  const [loading, setLoading] = useState(false)
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle")
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", username: "", email: "", password: "" },
  })

  const checkUsername = useCallback(async (value: string) => {
    if (!value) { setUsernameStatus("idle"); return }
    if (!/^[a-z0-9_]{3,20}$/.test(value)) { setUsernameStatus("invalid"); return }
    setUsernameStatus("checking")
    const res = await fetch(`/api/users/${value}`)
    setUsernameStatus(res.ok ? "taken" : "available")
  }, [])

  const usernameValue = form.watch("username")
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => checkUsername(usernameValue), 400)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [usernameValue, checkUsername])

  async function onSubmit(data: FormData) {
    if (usernameStatus === "taken") {
      form.setError("username", { message: "Username já está em uso" })
      return
    }

    setLoading(true)
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      setLoading(false)
      const body = await res.json()
      toast.error(body.error || "Erro ao criar conta")
      return
    }

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      toast.success("Conta criada! Faça login para continuar.")
      router.push("/login")
      return
    }

    router.push("/dashboard")
  }

  const usernameStatusIcon = {
    idle:      null,
    checking:  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />,
    available: <Check className="h-4 w-4 text-primary" />,
    taken:     <X className="h-4 w-4 text-destructive" />,
    invalid:   null,
  }[usernameStatus]

  return (
    <main className="flex items-center justify-center min-h-screen px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Criar conta</CardTitle>
          <CardDescription>Junte-se ao Mythara RPG</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apelido de jogador</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="seu_usuario"
                          className="pl-9 pr-9"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                        />
                        {usernameStatusIcon && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2">
                            {usernameStatusIcon}
                          </span>
                        )}
                      </div>
                    </FormControl>
                    {usernameStatus === "taken" && (
                      <p className="text-xs text-destructive">Username já está em uso</p>
                    )}
                    {usernameStatus === "available" && (
                      <p className="text-xs text-primary">Username disponível</p>
                    )}
                    <p className="text-[11px] text-muted-foreground/60">
                      Usado para que outros jogadores te encontrem
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={loading || usernameStatus === "taken" || usernameStatus === "checking"}
              >
                {loading ? "Criando conta..." : "Criar conta"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="text-sm text-center justify-center">
          Já tem conta?&nbsp;
          <Link href="/login" className="underline font-medium">
            Entrar
          </Link>
        </CardFooter>
      </Card>
    </main>
  )
}
