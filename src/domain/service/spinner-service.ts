export interface SpinnerService {
	start(options: { message: string }): void;
	end(options: { message: string }): void;
}
