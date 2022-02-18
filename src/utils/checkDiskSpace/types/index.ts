import { ChildProcess, ExecFileException } from "child_process";
import { existsSync } from "fs";
import { normalize, sep } from "path";

export type Dependencies = {
	platform: NodeJS.Platform
	fsExistsSync: typeof existsSync
	pathNormalize: typeof normalize
	pathSep: typeof sep
	cpExecFile: (file: string, args: ReadonlyArray<string> | undefined | null, callback: (error: ExecFileException | null, stdout: string, stderr: string) => void) => ChildProcess
}

/**
 * `free` and `size` are in bytes
 */
export type DiskSpace = {
	diskPath: string
	free: number
	size: number
}
