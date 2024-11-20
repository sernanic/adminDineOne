import React, { useEffect } from "react"
import { DataTable } from "@/components/shared/entityDataTable/EntityDataTable"
import { columns } from "./NotificationsColumns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Breadcrumbs from "@/components/shared/Breadcrumbs"
import EditNotificationDialog from "./EditNotificationDialog"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import useMerchantStore from "@/stores/merchantStore"
import { useNotifications } from "./hooks/useNotifications"

export default function Notifications() {
  const { currentUser } = useAuth()
  const { toast } = useToast()
  const selectedMerchantId = useMerchantStore((state) => state.selectedMerchantId)
  const [selectedNotification, setSelectedNotification] = React.useState(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isAddMode, setIsAddMode] = React.useState(false)

  const { 
    notifications, 
    isLoading, 
    error,
    createNotification,
    updateNotification,
    deleteNotification 
  } = useNotifications({ currentUser, selectedMerchantId })

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch notifications",
        variant: "destructive",
      })
    }
  }, [error, toast])

  const handleEditNotification = (notification) => {
    setIsAddMode(false)
    setSelectedNotification(notification)
    setIsEditDialogOpen(true)
  }

  const handleAddNotification = () => {
    setIsAddMode(true)
    setSelectedNotification({
      header: "",
      body: "",
      imageUrl: "",
    })
    setIsEditDialogOpen(true)
  }

  const handleSave = (notification) => {
    if (isAddMode) {
      createNotification(notification)
    } else {
      updateNotification(notification)
    }
    setIsEditDialogOpen(false)
  }

  const breadcrumbItems = [
    { label: 'Home', link: '/' },
    { label: 'Notifications' },
  ]

  return (
    <div className="container mx-auto py-2">
      <Breadcrumbs items={breadcrumbItems} />
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={notifications}
            isLoading={isLoading}
            filterColumn="header"
            meta={{
              onEdit: handleEditNotification,
              onDelete: deleteNotification,
            }}
            moreActions={[
              {
                label: "Add Notification",
                onClick: handleAddNotification
              }
            ]}
          />
        </CardContent>
      </Card>

      <EditNotificationDialog
        key={selectedNotification?.id || 'new'}
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false)
          setSelectedNotification(null)
        }}
        onSave={handleSave}
        notification={selectedNotification}
        isAddMode={isAddMode}
      />
    </div>
  )
}
