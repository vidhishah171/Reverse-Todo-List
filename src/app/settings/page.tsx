"use client";

import { motion } from "framer-motion";
import { Settings } from "lucide-react";
import { ProfileSettings } from "@/components/profile/profile-settings";
import { CategoryManager } from "@/components/categories/category-manager";
import { useCategories } from "@/hooks/use-categories";

export default function SettingsPage() {
    const { categories, createCategory, updateCategory, deleteCategory } = useCategories();

    return (
        <div className="max-w-2xl mx-auto p-6">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-6"
            >
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                        <Settings className="w-4 h-4 text-violet-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">Settings</h1>
                </div>
                <p className="text-sm text-muted-foreground">
                    Manage your profile, categories, and preferences.
                </p>
            </motion.div>

            <div className="space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                >
                    <ProfileSettings />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <CategoryManager
                        categories={categories}
                        onCreateCategory={createCategory}
                        onUpdateCategory={updateCategory}
                        onDeleteCategory={deleteCategory}
                    />
                </motion.div>
            </div>
        </div>
    );
}
