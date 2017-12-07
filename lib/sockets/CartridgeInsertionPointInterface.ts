export interface CartridgeInsertionPointInterface {
  isCollector: boolean
  cartridgeName: string
  cartridgePattern: string | RegExp
  index: number
  maxDepth: number
  cartridgeContent: string
}
