//import moment from 'moment-timezone';

export const formatAmount = (amount) => {
    if (amount === 0) return 'Rs.0';
    if (!amount) return '';
    return `Rs.${new Intl.NumberFormat('en-IN').format(amount)}`;
};

export const formatNumber = (value) => {
    if (value === 0) return '0';
    return `${new Intl.NumberFormat('en-IN').format(value)}`;
};
