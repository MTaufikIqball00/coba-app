export const RESTRICTED_FEATURES_FOR_NON_JABAR = {
    student: ["/tryout", "/forum", "/live-zoom"],
    teacher: ["/teacher/manajemen-tryout", "/teacher/forum", "/teacher/live-zoom"],
};

export const isFeatureRestricted = (
    role: string,
    province: string | undefined | null,
    pathname: string
): boolean => {
    if (province === "Jawa Barat") {
        return false;
    }

    if (!province) {
        // If province is unknown, should we restrict? 
        // For safety, maybe yes if we want to enforce Jabar only features.
        // But existing logic was: if Jabar return false.
        // So if not Jabar (or unknown), check restrictions.
    }

    const restrictedPaths =
        (RESTRICTED_FEATURES_FOR_NON_JABAR as any)[role] || [];
    return restrictedPaths.some((restrictedPath: string) =>
        pathname.startsWith(restrictedPath)
    );
};
