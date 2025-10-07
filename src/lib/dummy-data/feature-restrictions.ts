export const RESTRICTED_FEATURES_FOR_NON_JABAR = {
  student: ["/tryout", "/forum", "/live-zoom"],
  teacher: ["/teacher/manajemen-tryout", "/teacher/forum", "/teacher/live-zoom"],
};

export const isFeatureRestricted = (
  role: string,
  province: string,
  pathname: string
): boolean => {
  if (province === "Jawa Barat") {
    return false;
  }

  const restrictedPaths =
    (RESTRICTED_FEATURES_FOR_NON_JABAR as any)[role] || [];
  return restrictedPaths.some((restrictedPath: string) =>
    pathname.startsWith(restrictedPath)
  );
};