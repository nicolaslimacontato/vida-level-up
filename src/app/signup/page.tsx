"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, User } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    // Validação client-side da senha
    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      setLoading(false);
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setError(
        "A senha deve incluir pelo menos uma letra minúscula, uma maiúscula e um número.",
      );
      setLoading(false);
      return;
    }

    try {
      console.log("Attempting to sign up user:", email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            full_name: name,
          },
        },
      });

      if (error) {
        console.error("Signup error:", error);

        // Tratar erros específicos de senha
        if (
          error.message.includes("password") ||
          error.message.includes("Password")
        ) {
          if (
            error.message.includes("breach") ||
            error.message.includes("compromised")
          ) {
            setError(
              "Esta senha foi encontrada em vazamentos de dados. Por favor, escolha uma senha mais segura e única.",
            );
          } else if (
            error.message.includes("weak") ||
            error.message.includes("length")
          ) {
            setError(
              "A senha deve ter pelo menos 8 caracteres e incluir letras maiúsculas, minúsculas e números.",
            );
          } else {
            setError("Senha inválida. Escolha uma senha mais forte e única.");
          }
        } else {
          setError(error.message);
        }
      } else {
        console.log("Signup successful:", data);
        setSuccess(true);
        // Criar profile automaticamente
        if (data.user) {
          console.log("User created, creating profile...");
          console.log("User ID:", data.user.id);
          console.log("User email:", data.user.email);
          await createUserProfile(data.user.id, email, name);
        } else {
          console.warn("No user data returned from signup");
        }
      }
    } catch (err) {
      console.error("Unexpected signup error:", err);
      setError("Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const createUserProfile = async (
    userId: string,
    email: string,
    name: string,
  ) => {
    try {
      console.log("=== createUserProfile START ===");
      console.log("Creating user profile for:", userId);
      console.log("Email:", email);
      console.log("Name:", name);

      // Verificar se o perfil já existe (criado pelo trigger automático)
      console.log("Checking if profile already exists...");
      const { data: existingProfile, error: checkError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", userId)
        .single();

      console.log("Profile check result:", { existingProfile, checkError });

      if (checkError && checkError.code !== "PGRST116") {
        console.error("Error checking existing profile:", checkError);
        return;
      }

      // Se não existe, criar manualmente (fallback)
      if (!existingProfile) {
        console.log("Profile doesn't exist, creating new one...");
        const profileData = {
          id: userId,
          email,
          name,
          level: 1,
          current_xp: 0,
          total_xp: 0,
          coins: 100, // Moedas iniciais
          current_streak: 0,
          best_streak: 0,
          strength: 0,
          intelligence: 0,
          charisma: 0,
          discipline: 0,
        };

        console.log("Profile data to insert:", profileData);

        const { error } = await supabase.from("profiles").insert(profileData);

        if (error) {
          console.error("Erro ao criar perfil:", error);
        } else {
          console.log("Profile created successfully!");
        }
      } else {
        console.log("Profile already exists, skipping creation");
      }

      console.log("=== createUserProfile END ===");
    } catch (err) {
      console.error("Erro inesperado ao criar perfil:", err);
    }
  };

  const handleGithubSignup = async () => {
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `https://vida-level-up-4jgv.vercel.app/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      }
    } catch {
      setError("Erro inesperado. Tente novamente.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-green-600">
                Conta criada com sucesso! 🎉
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-muted-foreground">
                Verifique seu email para confirmar a conta e começar sua
                aventura!
              </p>
              <Button onClick={() => router.push("/login")} className="w-full">
                Ir para Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <h1
            className="text-primary mb-2 text-4xl font-bold"
            style={{ fontFamily: "var(--font-retro)" }}
          >
            Vida Level Up
          </h1>
          <p className="text-muted-foreground">Comece sua jornada épica!</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Criar Conta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20">
                {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <div className="relative">
                  <User className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    minLength={8}
                  />
                </div>
                <p className="text-muted-foreground text-xs">
                  Mínimo 8 caracteres, incluindo maiúscula, minúscula e número
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Criando conta..." : "Criar Conta"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background text-muted-foreground px-2">
                  Ou continue com
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleGithubSignup}
              disabled={loading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                />
              </svg>
              Github
            </Button>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Já tem uma conta? </span>
              <Link href="/login" className="text-primary hover:underline">
                Fazer login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
