import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import { getAuthUser } from "@/middleware/auth";

// GET all tasks for logged-in user
export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please login." },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter"); // all | completed | pending

    const query: any = { user: user.userId };
    if (filter === "completed") query.completed = true;
    if (filter === "pending") query.completed = false;

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      tasks,
      count: tasks.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// POST create a new task
export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please login." },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const { title, description, priority } = body;

    if (!title || title.trim() === "") {
      return NextResponse.json(
        { success: false, message: "Task title is required" },
        { status: 400 }
      );
    }

    const task = await Task.create({
      title: title.trim(),
      description: description?.trim(),
      priority: priority || "medium",
      user: user.userId,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Task created successfully",
        task,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
