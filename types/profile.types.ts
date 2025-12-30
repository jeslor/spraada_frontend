export interface ProfileActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
