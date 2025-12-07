import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DatePickerCustom.css';

interface DatePickerInputProps {
    label: string;
    selected: Date;
    onChange: (date: Date) => void;
    maxDate?: Date;
    required?: boolean;
}

export const DatePickerInput: React.FC<DatePickerInputProps> = ({
    label,
    selected,
    onChange,
    maxDate,
    required = false,
}) => {
    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                {label}
            </label>
            <DatePicker
                selected={selected}
                onChange={onChange}
                maxDate={maxDate}
                dateFormat="dd/MM/yyyy"
                required={required}
                className="w-full px-3 py-2 border rounded-md bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                calendarClassName="custom-calendar"
                wrapperClassName="w-full"
                showPopperArrow={false}
            />
        </div>
    );
};
