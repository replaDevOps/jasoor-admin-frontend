const rolepermissionData = [
    {
        key:1,
        rolename:'Super Admin',
        status:0
    },
    {
        key:2,
        rolename:'Content Manager',
        status:1
    },
    {
        key:3,
        rolename:'Super Admin',
        status:0
    },
    {
        key:4,
        rolename:'Listing Moderator',
        status:0
    },
    {
        key:5,
        rolename:'Sales Agent',
        status:0
    }
]

 const permissionsData = [
        {
            category: 'Dashboard',
            options: ['View Dashboard']
        },
        {
            category: 'Business Listing',
            options: ['View Listings', 'Edit Listings', 'Approve/Reject Listings']
        },
        {
            category: 'Meeting Request',
            options: [
                'View Meeting Requests',
                'Schedule Meetings',
                'Edit Meeting Details',
                'Cancel Meetings'
            ]
        },
        {
            category: 'Deals',
            options: [
                'View Deals',
                'Track Deal Progress',
                'Verify Documents',
                'Finalize Deal'
            ]
        },
        {
            category: 'Finance',
            options: [
                'View Finance Dashboard',
                'Download Financial Reports'
            ]
        },
        {
            category: 'Website Pages',
            options: [
                'View Website Pages',
                'Edit Article',
                'Delete Article',
                'Publish Article'
            ]
        },
        {
            category: 'Alerts',
            options: ['View Alerts']
        },
        {
            category: 'Admin Setting',
            options: ['Add/Edit/Delete Roles']
        }
    ];

export {rolepermissionData,permissionsData}