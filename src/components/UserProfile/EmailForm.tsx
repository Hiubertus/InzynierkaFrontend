// import React, { useState } from 'react';
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Alert, AlertDescription } from "@/components/ui/alert";
//
// interface EmailFormProps {
//     email: string;
//     onEmailUpdate: (email: string) => Promise<void>;
// }
//
// export const EmailForm: React.FC<EmailFormProps> = ({
//                                                         email,
//                                                         onEmailUpdate
//                                                     }) => {
//     const [newEmail, setNewEmail] = useState<string>(email);
//     const [error, setError] = useState<string>("");
//     const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
//
//     const validateEmail = (email: string): boolean => {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         return emailRegex.test(email);
//     };
//
//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setError("");
//
//         if (!newEmail) {
//             setError("Email is required");
//             return;
//         }
//
//         if (!validateEmail(newEmail)) {
//             setError("Invalid email address");
//             return;
//         }
//
//         try {
//             setIsSubmitting(true);
//             await onEmailUpdate(newEmail);
//         } catch (err) {
//             setError(err instanceof Error ? err.message : "Failed to update email");
//         } finally {
//             setIsSubmitting(false);
//         }
//     };
//
//     return (
//         <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="space-y-2">
//                 <Label htmlFor="email">New email address</Label>
//                 <Input
//                     id="email"
//                     type="email"
//                     value={newEmail}
//                     onChange={(e) => setNewEmail(e.target.value)}
//                     placeholder="Enter new email address"
//                     disabled={isSubmitting}
//                 />
//             </div>
//
//             {error && (
//                 <Alert variant="destructive">
//                     <AlertDescription>{error}</AlertDescription>
//                 </Alert>
//             )}
//
//             <Button
//                 type="submit"
//                 className="w-full"
//                 disabled={isSubmitting || newEmail === email}
//             >
//                 {isSubmitting ? "Updating..." : "Update email"}
//             </Button>
//         </form>
//     );
// };