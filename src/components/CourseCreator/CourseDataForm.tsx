import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/CourseCreator/FileUpload";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { CourseForm } from "@/components/CourseCreator/formSchema";
import {TagInput} from "@/components/CourseCreator/TagInput";

interface CourseDataFormProps {
    form: UseFormReturn<CourseForm>
}

export const CourseDataForm: React.FC<CourseDataFormProps> = ({ form }) => {

    return (
        <Card className="mb-4 shadow-md">
            <CardHeader className="bg-gray-50">Course Details</CardHeader>
            <CardContent>
                <div className="py-3">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Input {...field} placeholder="Course Name"/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                <div className="py-3">
                    <FormField
                        control={form.control}
                        name="banner"
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <FileUpload onFileUploaded={(file) => field.onChange(file)} accept={{'image/*': []}}
                                                maxSize={5 * 1024 * 1024}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                <div className="py-3">
                    <FormField
                        control={form.control}
                        name="description"
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea {...field} placeholder="Course Description"/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                <div className="py-3">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Course Price"
                                        type="number"
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                <div className="py-3">
                    <FormField
                        control={form.control}
                        name="duration"
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Course Duration (in hours)"
                                        type="number"
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                <TagInput form={form}/>
            </CardContent>
        </Card>
    );
};
