import React, { useState, useEffect } from 'react';
import Select, { MultiValue, SingleValue } from 'react-select';

// Définir le type pour les options
interface OptionType {
    value: number;
    label: string;
}

// Définir les propriétés du composant
interface SelectListProps {
    defaultOption: string;
    selectMultiple?: boolean;
    options?: OptionType[];
    onChange?: (selected: SingleValue<OptionType> | MultiValue<OptionType>, name?: string, checked?: boolean) => void;
    name?: string;
    value?: SingleValue<OptionType> | MultiValue<OptionType>;
}

const SelectList: React.FC<SelectListProps> = ({
    defaultOption,
    selectMultiple = false,
    options = [],
    onChange,
    name,
    value
}) => {
    const [selectedOption, setSelectedOption] = useState<SingleValue<OptionType> | MultiValue<OptionType>>(
        value || (selectMultiple ? [] : null)
    );
    const [isChecked, setIsChecked] = useState(false);

    useEffect(() => {
        setSelectedOption(value || (selectMultiple ? [] : null));
    }, [value, selectMultiple]);

    const handleChange = (selected: SingleValue<OptionType> | MultiValue<OptionType>) => {
        setSelectedOption(selected);
        if (onChange) {
            onChange(selected, name, isChecked);
        }
    };

    const handleCheckBox = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(event.target.checked);
        if (onChange) {
            onChange(selectedOption, name, event.target.checked);
        }
    };

    const isValueSelected = selectMultiple
        ? Array.isArray(selectedOption) && selectedOption.length > 0
        : selectedOption !== null;

    return (
        <div className="p-4">
            {selectMultiple ? (
                <Select
                    name={name}
                    value={selectedOption as MultiValue<OptionType>}
                    onChange={handleChange}
                    options={options}
                    isMulti
                    placeholder={`Select ${defaultOption}`}
                />
            ) : (
                <>
                    <Select
                        name={name}
                        value={selectedOption as SingleValue<OptionType>}
                        onChange={handleChange}
                        options={options}
                        placeholder={`Select ${defaultOption}`}
                    />
                    {isValueSelected && name === 'longDestination' && (
                        <div>
                            <label>
                                <input type="checkbox" checked={isChecked} onChange={handleCheckBox} />
                                Check if the destination has not been completed :(
                            </label>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default SelectList;