import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/CourseCreator/FileUpload";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { CourseForm } from "@/components/CourseCreator/formSchema";
import { TagInput } from "@/components/CourseCreator/TagInput";

interface CourseDataFormProps {
    form: UseFormReturn<CourseForm>
}

export const CourseDataForm: React.FC<CourseDataFormProps> = ({ form }) => {
    const currentBanner = form.watch('banner');

    return (
        <Card className="mb-4 shadow-md">
            <CardHeader className="bg-gray-50">Course Details</CardHeader>
            <CardContent className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Course Name</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Enter course name"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="banner"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Course Banner</FormLabel>
                            <FormControl>
                                <FileUpload
                                    onFileUploaded={(file) => {
                                        field.onChange(file);
                                        if (file) {
                                            if (file.type.startsWith('image/')) {
                                                form.setValue('bannerType', 'image');
                                                form.setValue('bannerMediaType',
                                                    file.type === 'image/jpeg' ? 'image/jpeg' :
                                                        file.type === 'image/png' ? 'image/png' :
                                                            file.type === 'image/gif' ? 'image/gif' : 'image/jpeg'
                                                );
                                            } else if (file.type.startsWith('video/')) {
                                                form.setValue('bannerType', 'video');
                                                form.setValue('bannerMediaType',
                                                    file.type === 'video/mp4' ? 'video/mp4' :
                                                        file.type === 'video/webm' ? 'video/webm' : 'video/mp4'
                                                );
                                            }
                                        }
                                    }}
                                    currentFile={currentBanner}
                                    accept={{
                                        'image/*': [],
                                        'video/*': []
                                    }}
                                    maxSize={5 * 1024 * 1024}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Course Description</FormLabel>
                            <FormControl>
                                <Textarea {...field} placeholder="Enter course description"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="price"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Course Price (points)</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Enter course price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="duration"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Course Duration (hours)</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Enter course duration"
                                    type="number"
                                    min="0"
                                    step="0.5"
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormItem>
                    <FormLabel>Course Tags</FormLabel>
                    <TagInput form={form}/>
                </FormItem>
            </CardContent>
        </Card>
    );
};