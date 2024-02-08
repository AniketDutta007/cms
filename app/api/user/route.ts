import { NextRequest, NextResponse } from "next/server";
import {z} from "zod";

import { prisma } from "@/server/db/client";
import { hashPassword } from "@/server/password";

const userSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    role: z.enum(['USER', 'CANTEEN', 'ADMIN'])
});

export async function POST(req:NextRequest, res:NextResponse) {
    try {
        const parsedData = userSchema.safeParse(await req.json());
		if (!parsedData.success) {
			return NextResponse.json(
				{
					errors: parsedData.error.formErrors.fieldErrors,
				},
				{ status: 400 }
			);
		} else {
			const userDTO = parsedData.data;
            console.log(userDTO);
            const user = await prisma.user.create({
                data: {
                    name: userDTO.name,
                    email: userDTO.email,
                    password: await hashPassword(userDTO.password),
                    role: userDTO.role
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true
                }
            });
            return NextResponse.json({
                message: "User created successfully",
                data: user
            });

        }
    } catch (error:any) {
        if (process.env.NODE_ENV === 'development') {
			console.log(error);
		}
		if (error.code === 'P2002') {
			return NextResponse.json(
				{
					error: 'User with this email already exists for this role.',
				},
				{
					status: 400,
				}
			);
		}
    }
}