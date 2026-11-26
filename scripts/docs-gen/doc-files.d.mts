/** Repo-relative paths of every shipped doc (`docs/**\/*.md` without docs/superpowers), sorted. */
export declare function docFiles(repo: string): string[];
/** Reads a repo-relative file as UTF-8. */
export declare function readRepoFile(repo: string, rel: string): string;
