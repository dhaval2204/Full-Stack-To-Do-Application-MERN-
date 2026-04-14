import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Task from "@/models/Task";
import { getAuthUser } from "@/middleware/auth";

// PUT update a task
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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
    const { title, description, completed, priority } = body;

    const task = await Task.findOne({ _id: params.id, user: user.userId });

    if (!task) {
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 }
      );
    }

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (completed !== undefined) task.completed = completed;
    if (priority !== undefined) task.priority = priority;

    await task.save();

    return NextResponse.json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE a task
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = getAuthUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized. Please login." },
        { status: 401 }
      );
    }

    await dbConnect();

    const task = await Task.findOneAndDelete({ _id: params.id, user: user.userId });

    if (!task) {
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
