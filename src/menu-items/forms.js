
// third-party
import { FormattedMessage } from 'react-intl';
// assets
import { IconClipboardCheck,IconBuildingEstate,IconCategory,IconCoinRupee,IconMenu,IconMenuOrder,IconBackpack, IconBrandProducthunt,IconArrowMergeBoth, 
    IconBuildingWarehouse, IconFileDatabase, IconUserPlus, IconLocation, IconAddressBook, 
    IconUsers, IconBrandGoogleHome, IconPictureInPicture, IconForms, IconBorderAll, IconChartDots, 
    IconStairsUp, IconCertificate2, IconCalendar, IconCalendarEvent, IconCalendarTime, IconFilePlus,
     IconUserExclamation, IconUserX, IconUserCheck, IconReportMoney, IconZoomMoney, 
     IconBrandGmail,IconMoneybag} from '@tabler/icons';
// constant
const icons = {
    IconBrandProducthunt,
    IconBackpack,
    IconCategory,
    IconClipboardCheck,
    IconPictureInPicture,
    IconForms,
    IconBorderAll,
    IconChartDots,
    IconStairsUp,
    IconCertificate2,
    IconBrandGoogleHome,
    IconUsers,
    IconAddressBook,
    IconUserPlus,
    IconFileDatabase,
    IconBuildingWarehouse,
    IconCalendar,
    IconCalendarEvent,
    IconCalendarTime,
    IconFilePlus,
    IconUserExclamation,
    IconUserX,
    IconUserCheck,
    IconArrowMergeBoth,
    IconReportMoney,
    IconZoomMoney,
    IconLocation,
    IconMenuOrder,
    IconMenu,
    IconCoinRupee,
    IconBuildingEstate,
    IconBrandGmail,
    IconMoneybag
    
};
// ==============================|| UI FORMS MENU ITEMS ||============================== //
const forms = {
    id: 'ui-forms',
    title: <FormattedMessage id="Menu" />,
    icon: icons.IconPictureInPicture,
    type: 'group',
    children: [

        {
            id: 'Master',
            title: <FormattedMessage id="Master" />,
            type: 'collapse',
            icon: icons.IconChartDots,
            children: [

                {
                    id: 'tbl-basic1',
                    title: <FormattedMessage id="Category" />,
                    type: 'item',
                    url: '/apsara-pages/category',
                    icon: icons.IconCategory,
                },
                
                {
                    id: 'tbl-basic2',
                    title: <FormattedMessage id="Product" />,
                    type: 'item',
                    url: '/apsara-pages/products',
                    icon: icons.IconCategory,
                },

                {
                    id: 'tbl-basic3',
                    title: <FormattedMessage id="Combo" />,
                    type: 'item',
                    url: '/apsara-pages/combo',
                    icon: icons.IconCategory,
                },
            ]
        },
        // {
        //     id: 'Customer',
        //     title: <FormattedMessage id="customerTitle" />,
        //     type: 'collapse',
        //     icon: icons.IconChartDots,
        //     children: [


        //         {
        //             id: 'tbl-basic6',
        //             title: <FormattedMessage id="Users" />,
        //             type: 'item',
        //             url: '/creative-products/users',
        //             icon: icons.IconUsers,
        //         },

        //         {
        //             id: 'tbl-basic-customprice',
        //             title: <FormattedMessage id="product_set_custom_price" />,
        //             type: 'item',
        //             url: '/creative-products/productcustomprice',
        //             icon: icons.IconCoinRupee,
        //         },

        //     ]
        // },
        // {
        //     id: 'Order',
        //     title: <FormattedMessage id="orderTitle" />,
        //     type: 'collapse',
        //     icon: icons.IconChartDots,
        //     children: [
        //         {
        //             id: 'tbl-basic4',
        //             title: <FormattedMessage id="orderView" />,
        //             type: 'item',
        //             url: '/creative-products/orderview',
        //             icon: icons.IconMenuOrder,
        //         },         

        //         {
        //             id: 'tbl-basic-shipping',
        //             title: <FormattedMessage id="shipping_View_details" />,
        //             type: 'item',
        //             url: '/creative-products/shipping',
        //             icon: icons.IconMoneybag,
        //         },    
                
        //     ]
        // },
        // {
        //     id: 'Config',
        //     title: <FormattedMessage id="Config" />,
        //     type: 'collapse',
        //     icon: icons.IconChartDots,
        //     children: [

        //         {
        //             id: 'tbl-basic5',
        //             title: <FormattedMessage id="admin_users" />,
        //             type: 'item',
        //             url: '/creative-products/adminusers',
        //             icon: icons.IconUserCheck,
        //         },
                
        //         {
        //             id: 'tbl-basic10',
        //             title: <FormattedMessage id="Email" />,
        //             type: 'item',
        //             url: '/creative-products/mail',
        //             icon: icons.IconBrandGmail,
        //         },
                
        //     ]
        // },

    ],
};
export default forms;


