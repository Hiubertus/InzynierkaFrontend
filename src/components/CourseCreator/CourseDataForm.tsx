import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {FileUpload} from "@/components/CourseCreator/FileUpload";
import {Textarea} from "@/components/ui/textarea";
import React from "react";
import {CourseData} from "@/models/CourseData";
import {UseFormReturn} from "react-hook-form";

interface CourseDataFormProps {
    form: UseFormReturn<CourseData>
    setCourseName: (name: string) => void;
    setCourseBanner: (file: File) => void;
    setCourseDescription: (description: string) => void;
}

export const CourseDataForm: React.FC<CourseDataFormProps> = ({form, setCourseName, setCourseBanner, setCourseDescription}) => {
    return(<Card className="mb-4 shadow-md">
        <CardHeader className="bg-gray-50">Course Details</CardHeader>
        <CardContent>
            <FormField
                control={form.control}
                name="name"
                render={({field}) => (
                    <FormItem>
                        <FormControl>
                            <Input
                                {...field}
                                placeholder="Course Name"
                                onChange={(e) => {
                                    setCourseName(e.target.value);
                                    field.onChange(e);
                                }}
                            />
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
                        <FormControl>
                            <FileUpload
                                onFileUploaded={(file) => {
                                    setCourseBanner(file);
                                    field.onChange(file);
                                }}
                                accept={{'image/*': []}}
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
                        <FormControl>
                            <Textarea
                                {...field}
                                placeholder="Course Description"
                                onChange={(e) => {
                                    setCourseDescription(e.target.value);
                                    field.onChange(e);
                                }}
                            />
                        </FormControl>
                        <FormMessage/>
                    </FormItem>
                )}
            />
        </CardContent>
    </Card>)
}