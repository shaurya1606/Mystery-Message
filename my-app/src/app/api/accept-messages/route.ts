import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
    await dbConnect();

    const session = await auth();
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Unauthorized"
            },
            {
                status: 401
            }
        )
    }
    const userId = user._id;
    const {acceptMessages} = await request.json();

    try{
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { isAccepteingMessage: acceptMessages },
            { new: true}
        )
        return Response.json(
            {
                success: true,
                message: "Successfully updated message acceptance",
                updatedUser
            },
            {
                status: 200
            }
        );
    }
    catch (error) {
        console.log("Error accepting messages:", error);
        return Response.json(
            {
                success: false,
                message: "Error accepting messages"
            },
            {
                status: 401
            }
        );
    }
}

export async function GET(request:Request) {
     await dbConnect();

    const session = await auth();
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Unauthorized"
            },
            {
                status: 401
            }
        )
    }
    const userId = user._id;
    try {
    const foundUser = await UserModel.findById(userId);

    if(!foundUser) {
        return Response.json(
            {
                success: false,
                message: "User not found"
            },
            { status: 404 }
        )
    }
    
    return Response.json(
            {
                success: true,
                isAcceptingMessages: foundUser.isAcceptingMessage
            },
            { status: 200 }
        )
    }

    catch (error) {
        console.log("Error fetching user acceptance status:", error);
        return Response.json(
            {
                success: false,
                message: "Error fetching user acceptance status"
            },
            { status: 500 }
        );
    }
}