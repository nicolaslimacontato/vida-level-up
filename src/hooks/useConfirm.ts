"use client";

import { useState, useCallback } from "react";

interface ConfirmOptions {
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "destructive" | "warning" | "success";
}

interface ConfirmState extends ConfirmOptions {
    open: boolean;
    onConfirm?: () => void;
    onCancel?: () => void;
}

export function useConfirm() {
    const [confirmState, setConfirmState] = useState<ConfirmState>({
        open: false,
        title: "",
        description: "",
    });

    const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
        return new Promise((resolve) => {
            setConfirmState({
                ...options,
                open: true,
                onConfirm: () => resolve(true),
                onCancel: () => resolve(false),
            });
        });
    }, []);

    const closeConfirm = useCallback(() => {
        setConfirmState((prev) => ({ ...prev, open: false }));
    }, []);

    return {
        confirmState,
        confirm,
        closeConfirm,
    };
}
