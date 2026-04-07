export const isPropertyValueValid = (text: string | undefined): boolean => {
    return text !== undefined && text !== '' && text !== '<-' && text !== '->';
};
