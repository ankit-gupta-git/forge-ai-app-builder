"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Calendar, Trash2, ArrowRight } from "lucide-react";
import { deleteProject } from "@/actions/projects";
import type { ProjectSummary } from "@/types/project";
import { toast } from "sonner";

interface ProjectCardProps {
  projects: ProjectSummary[];
}

export function ProjectCard({ projects: initialProjects }: ProjectCardProps) {
  const [projects, setProjects] = useState<ProjectSummary[]>(initialProjects);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    // Trigger physical haptic feedback if supported (vibration)
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(20);
    }

    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success("Project deleted successfully");
    } catch {
      toast.error("Failed to delete project");
    }
  };

  const triggerHaptic = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  } as const;

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
  } as const;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <AnimatePresence mode="popLayout">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            variants={item}
            layout
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/8 bg-[#0f0f0f] p-5 transition-colors hover:border-white/15"
          >
            {/* Ambient background glow effect on card hover */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-500/0 via-blue-500/0 to-blue-500/0 opacity-0 transition-opacity duration-500 group-hover:from-blue-500/2 group-hover:to-blue-500/4 group-hover:opacity-100" />

            <div>
              <div className="flex items-start justify-between gap-4">
                <Link
                  href={`/workspace?id=${project.id}`}
                  onClick={triggerHaptic}
                  className="flex-1 min-w-0"
                >
                  <h3 className="truncate font-serif text-lg font-medium text-white/90 group-hover:text-blue-400 transition-colors">
                    {project.title ?? "Untitled App"}
                  </h3>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => handleDelete(e, project.id)}
                  className="rounded-lg p-1.5 text-white/30 hover:bg-red-500/10 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </motion.button>
              </div>

              <p className="mt-2.5 line-clamp-3 text-xs leading-relaxed text-white/40">
                {project.firstPrompt ?? "No prompt available"}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-white/6 pt-4 text-[11px] text-white/35">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5" />
                  {project.messageCount}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(project.updatedAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>

              <Link
                href={`/workspace?id=${project.id}`}
                onClick={triggerHaptic}
                className="flex items-center gap-1 text-[11px] font-semibold text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                Open IDE
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
