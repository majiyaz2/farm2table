"use client"
import { useForm } from "react-hook-form"
import { registerSchema } from "../../schema"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Poppins } from "next/font/google"
import { toast } from "sonner"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useMutation } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/client"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["700"],
});


export const SignUpView = () => {
    const router = useRouter()
    const queryClient = useQueryClient()

    const trpc = useTRPC()
    const session = useMutation(trpc.auth.register.mutationOptions({
        onSuccess: async () => {
            await queryClient.invalidateQueries(trpc.auth.session.queryFilter())
            toast("User registered successfully")
            router.push("/")
        },
        onError: (error) => {
            toast(error.message)
        }
    }));

    const form = useForm<z.infer<typeof registerSchema>>({
        mode: "all",
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            username: "",
        }
    })

    const onSubmit = (values: z.infer<typeof registerSchema>) => {
        session.mutate(values)
    }

    const username = form.watch("username");
    const usernameErrors = form.formState.errors.username;

    const showPreview = username && !usernameErrors
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-5">
            <div className="bg-[#f4f4f0] h-screen w-full lg:col-span-3 overflow-y-auto">
                <Form {...form}>
                    <form 
                        onSubmit={form.handleSubmit(onSubmit)} 
                        className="flex flex-col gap-8 p-4 lg:p-16">
                            <div className="flex items-center justify-between mb-8">
                                <Link href="/">
                                    <span className={cn("text-2xl font-semibold", poppins.className)}>
                                        Farm2Table
                                    </span>
                                </Link>
                                <Button
                                    asChild
                                    variant={"ghost"}
                                    size={"sm"}
                                    className="text-base border-none underline"
                                >
                                    <Link prefetch href="/sign-in">
                                        Sign In
                                    </Link>
                                </Button>
                            </div>
                            <h1 className="text-4xl font-medium">
                                Join over 958 farmers and sell your produce directly to consumers
                            </h1>
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">Username</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormDescription
                                            className={cn("hidden", showPreview && "block")}
                                        >
                                            Your store will be available at &nbsp;
                                            <strong>
                                                {field.value}.farm2table.com
                                            </strong>
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base">Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
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
                                        <FormLabel className="text-base">Password</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="password" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                disabled={session.isPending}
                                type="submit"
                                size={"lg"}
                                variant={"elevated"}
                                className="bg-black text-white hover:bg-pink-400 hover:text-primary"
                            >
                                Sign Up
                            </Button>
                    </form>
                </Form>
            </div>
            <div className="h-screen w-full lg:col-span-2 hidden lg:block"
                style={{
                    backgroundImage: "url('/auth-bg.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />
        </div>
    )
}