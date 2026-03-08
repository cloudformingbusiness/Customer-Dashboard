import type { ComponentType, LazyExoticComponent } from 'react'

export interface IModuleRoute {
  path:      string
  element:   LazyExoticComponent<ComponentType>
  children?: IModuleRoute[]
}

export interface INavItem {
  label:     string
  path:      string
  icon:      string
  badge?:    () => number | string | null
  children?: INavItem[]
}

export interface IModule {
  id:                  string
  name:                string
  icon:                string
  description:         string
  version:             string
  isCore:              boolean
  requiredPermission:  string
  routes:              IModuleRoute[]
  navItems:            INavItem[]
  apiPrefix?:          string
  initialize?:         () => Promise<void>
}
