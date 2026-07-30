<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreTemplateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'template' => ['required', 'file', 'mimes:zip', 'max:10240'],
        ];
    }

    public function messages(): array
    {
        return [
            'template.required' => 'Debes seleccionar un archivo ZIP.',
            'template.file' => 'El archivo debe ser un ZIP válido.',
            'template.mimes' => 'Solo se permiten archivos ZIP.',
            'template.max' => 'El archivo no puede superar los 10MB.',
        ];
    }
}
