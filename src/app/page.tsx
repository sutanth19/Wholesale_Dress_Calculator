'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, ShoppingBag, Calculator, Eye, EyeOff, Download } from 'lucide-react'

interface DressOrder {
  id: string
  dressType: string
  pricePerPiece: number
  sizeCount: number
  colourCount: number
  totalPieces: number
  totalPrice: number
}

const dressTypes = [
  'Palazzo Suit',
  'Lehenga',
  'Short Anarkali',
  'Normal Suit',
  'Long Anarkali',

]

export default function WholesaleDressCalculator() {
  const [dressType, setDressType] = useState('')
  const [pricePerPiece, setPricePerPiece] = useState('')
  const [sizeCount, setSizeCount] = useState('')
  const [colourCount, setColourCount] = useState('')
  const [orders, setOrders] = useState<DressOrder[]>([])
  const [showAllOrders, setShowAllOrders] = useState(false)

  const addOrder = () => {
    if (!dressType || !pricePerPiece || !sizeCount || !colourCount) {
      alert('Please fill all fields')
      return
    }

    const price = parseFloat(pricePerPiece)
    const sizes = parseInt(sizeCount)
    const colours = parseInt(colourCount)
    const totalPieces = sizes * colours
    const totalPrice = totalPieces * price

    const newOrder: DressOrder = {
      id: Date.now().toString(),
      dressType,
      pricePerPiece: price,
      sizeCount: sizes,
      colourCount: colours,
      totalPieces,
      totalPrice
    }

    setOrders([...orders, newOrder])

    // Reset form
    setDressType('')
    setPricePerPiece('')
    setSizeCount('')
    setColourCount('')
  }

  const removeOrder = (id: string) => {
    setOrders(orders.filter(order => order.id !== id))
  }

  const grandTotal = orders.reduce((sum, order) => sum + order.totalPrice, 0)
  const grandTotalPieces = orders.reduce((sum, order) => sum + order.totalPieces, 0)

  // Get orders to display
  const displayedOrders = showAllOrders ? orders : orders.slice(-1) // Show only latest if not showing all

  const downloadPDF = () => {
    // Create PDF content as HTML
    const currentDate = new Date().toLocaleDateString('en-IN')
    const currentTime = new Date().toLocaleTimeString('en-IN')
    
    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Wholesale Dress Order Summary</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.4; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 15px; margin-bottom: 30px; }
        .title { font-size: 24px; font-weight: bold; margin-bottom: 8px; }
        .date-time { color: #666; font-size: 14px; }
        
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #f8f9fa; font-weight: bold; text-align: center; }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        
        .summary-table { margin-top: 30px; background-color: #1e293b; color: white; }
        .summary-table th, .summary-table td { border-color: #475569; }
        .summary-table th { background-color: #334155; }
        
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 15px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">WHOLESALE DRESS ORDER SUMMARY</div>
        <div class="date-time">Date: ${currentDate} | Time: ${currentTime}</div>
    </div>

    <table>
        <thead>
            <tr>
                <th>S.No</th>
                <th>Dress Type</th>
                <th>Price/Piece</th>
                <th>Sizes</th>
                <th>Colours</th>
                <th>Total Pieces</th>
                <th>Total Price</th>
            </tr>
        </thead>
        <tbody>
`

    orders.forEach((order, index) => {
      htmlContent += `
            <tr>
                <td class="text-center">${index + 1}</td>
                <td>${order.dressType}</td>
                <td class="text-right">₹${order.pricePerPiece.toLocaleString()}</td>
                <td class="text-center">${order.sizeCount}</td>
                <td class="text-center">${order.colourCount}</td>
                <td class="text-center"><strong>${order.totalPieces}</strong></td>
                <td class="text-right"><strong>₹${order.totalPrice.toLocaleString()}</strong></td>
            </tr>
`
    })

    htmlContent += `
        </tbody>
    </table>

    <table class="summary-table">
        <tr>
            <th colspan="3">ORDER SUMMARY</th>
        </tr>
        <tr>
            <th>Total Items</th>
            <th>Total Pieces</th>
            <th>Grand Total</th>
        </tr>
        <tr>
            <td class="text-center"><strong>${orders.length}</strong></td>
            <td class="text-center"><strong>${grandTotalPieces}</strong></td>
            <td class="text-center"><strong>₹${grandTotal.toLocaleString()}</strong></td>
        </tr>
    </table>

    <table style="margin-top: 20px;">
        <thead>
            <tr>
                <th colspan="2" style="background-color: #f8f9fa;">DRESS TYPE BREAKDOWN</th>
            </tr>
            <tr>
                <th>Dress Type</th>
                <th>Total Pieces</th>
            </tr>
        </thead>
        <tbody>
`

    // Calculate dress type breakdown
    const dressTypeBreakdown = orders.reduce((acc, order) => {
      if (acc[order.dressType]) {
        acc[order.dressType] += order.totalPieces
      } else {
        acc[order.dressType] = order.totalPieces
      }
      return acc
    }, {} as Record<string, number>)

    // Add dress type rows
    Object.entries(dressTypeBreakdown).forEach(([dressType, pieces]) => {
      htmlContent += `
            <tr>
                <td>${dressType}</td>
                <td class="text-center"><strong>${pieces} pieces</strong></td>
            </tr>
`
    })

    htmlContent += `
        </tbody>
    </table>

    <div class="footer">
        Generated by Wholesale Dress Calculator<br>
        © ${new Date().getFullYear()} - Professional Order Management
    </div>
</body>
</html>
`

    // Create PDF using print functionality
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      printWindow.focus()
      
      // Auto-trigger print dialog which allows saving as PDF
      setTimeout(() => {
        printWindow.print()
      }, 250)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            Wholesale Dress Calculator
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Calculate total pieces and pricing for wholesale dress orders
          </p>
        </div>

        {/* Input Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <Calculator className="h-5 w-5 text-blue-600" />
              Add New Order
            </CardTitle>
            <CardDescription>
              Fill in the details to calculate total pieces and price
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Dress Type */}
              <div className="space-y-2">
                <Label htmlFor="dress-type" className="text-sm font-medium">
                  Dress Type
                </Label>
                <Select value={dressType} onValueChange={setDressType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select dress type" />
                  </SelectTrigger>
                  <SelectContent>
                    {dressTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price per Piece */}
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-medium">
                  Price per Piece (₹)
                </Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="1295"
                  value={pricePerPiece}
                  onChange={(e) => setPricePerPiece(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Size Count */}
              <div className="space-y-2">
                <Label htmlFor="size-count" className="text-sm font-medium">
                  Size Count
                </Label>
                <Select value={sizeCount} onValueChange={setSizeCount}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select sizes" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'Size' : 'Sizes'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Colour Count */}
              <div className="space-y-2">
                <Label htmlFor="colour-count" className="text-sm font-medium">
                  Colour Count
                </Label>
                <Select value={colourCount} onValueChange={setColourCount}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select colours" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'Colour' : 'Colours'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Add Button */}
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button 
                onClick={addOrder} 
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                Add to Cart
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {orders.length > 0 && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
                {showAllOrders ? `All Orders (${orders.length} items)` : `Latest Order`}
              </h2>
              
              <div className="flex gap-2">
                {orders.length > 1 && (
                  <Button
                    onClick={() => setShowAllOrders(!showAllOrders)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {showAllOrders ? (
                      <>
                        <EyeOff className="h-4 w-4" />
                        Show Latest Only
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4" />
                        Show All ({orders.length})
                      </>
                    )}
                  </Button>
                )}
                
                <Button
                  onClick={downloadPDF}
                  variant="default"
                  size="sm"
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </div>

            {/* Orders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {displayedOrders.map((order) => (
                <Card key={order.id} className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-semibold text-blue-900">
                        {order.dressType}
                      </CardTitle>
                      <Button
                        onClick={() => removeOrder(order.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-gray-600">Price per piece:</div>
                      <div className="font-semibold text-right">₹{order.pricePerPiece.toLocaleString()}</div>
                      
                      <div className="text-gray-600">Sizes:</div>
                      <div className="font-semibold text-right">{order.sizeCount}</div>
                      
                      <div className="text-gray-600">Colours:</div>
                      <div className="font-semibold text-right">{order.colourCount}</div>
                    </div>
                    
                    <div className="border-t pt-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Total Pieces:</span>
                        <span className="text-lg font-bold text-blue-600">{order.totalPieces}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Total Price:</span>
                        <span className="text-lg font-bold text-green-600">₹{order.totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Grand Total */}
            <Card className="bg-slate-900 text-white shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between text-center">
                  <div>
                    <div className="text-xl sm:text-2xl font-bold">{orders.length}</div>
                    <div className="text-xs sm:text-sm text-slate-300">Items</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold">{grandTotalPieces}</div>
                    <div className="text-xs sm:text-sm text-slate-300">Pieces</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold">₹{grandTotal.toLocaleString()}</div>
                    <div className="text-xs sm:text-sm text-slate-300">Grand Total</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dress Type Breakdown */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Dress Type Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(
                    orders.reduce((acc, order) => {
                      if (acc[order.dressType]) {
                        acc[order.dressType] += order.totalPieces
                      } else {
                        acc[order.dressType] = order.totalPieces
                      }
                      return acc
                    }, {} as Record<string, number>)
                  ).map(([dressType, pieces]) => (
                    <div key={dressType} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                      <span className="text-gray-700 font-medium">{dressType}</span>
                      <span className="text-blue-600 font-bold">{pieces} pieces</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {orders.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="space-y-3">
                <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto" />
                <h3 className="text-lg font-medium text-gray-900">No orders added yet</h3>
                <p className="text-gray-500">Add your first dress order using the form above</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}