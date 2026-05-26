/**
 * Factory Method Pattern implementation for Admin Theme Switching (Light/Dark mode)
 * 
 * 1. Product interface: ThemeProduct
 * 2. Concrete Products: LightThemeProduct, DarkThemeProduct
 * 3. Creator abstract class: ThemeCreator
 * 4. Concrete Creators: LightThemeCreator, DarkThemeCreator
 * 5. Selection / Client Helper: ThemeFactorySelector
 */

// ─── 1. THEME PRODUCT INTERFACE ──────────────────────────────────────────────
export interface ThemeProduct {
  themeName: 'light' | 'dark';
  getBgClass(): string;
  getSidebarBgClass(): string;
  getTextClass(): string;
  getBorderClass(): string;
  getMenuActiveBtnClass(): string;
  getMenuInactiveBtnClass(): string;
  getHeaderBgClass(): string;
  getCardBgClass(): string;
  getCardTextClass(): string;
  getTextMutedClass(): string;
  getHoverBgClass(): string;
}

// ─── 2. CONCRETE PRODUCTS ───────────────────────────────────────────────────

/**
 * Concrete Product for Light Theme
 */
class LightThemeProduct implements ThemeProduct {
  themeName = 'light' as const;

  getBgClass(): string {
    return 'bg-gray-100 text-gray-900';
  }

  getSidebarBgClass(): string {
    return 'bg-white border-r border-gray-200';
  }

  getTextClass(): string {
    return 'text-gray-900';
  }

  getBorderClass(): string {
    return 'border-gray-200';
  }

  getMenuActiveBtnClass(): string {
    return 'bg-t1-red text-white shadow-md shadow-red-500/20';
  }

  getMenuInactiveBtnClass(): string {
    return 'text-gray-600 hover:bg-gray-100 hover:text-gray-900';
  }

  getHeaderBgClass(): string {
    return 'bg-white/80 border-b border-gray-200 backdrop-blur-md';
  }

  getCardBgClass(): string {
    return 'bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300';
  }

  getCardTextClass(): string {
    return 'text-gray-800';
  }

  getTextMutedClass(): string {
    return 'text-gray-500';
  }

  getHoverBgClass(): string {
    return 'hover:bg-gray-50';
  }
}

/**
 * Concrete Product for Dark Theme
 */
class DarkThemeProduct implements ThemeProduct {
  themeName = 'dark' as const;

  getBgClass(): string {
    return 'bg-[#050505] text-white';
  }

  getSidebarBgClass(): string {
    return 'bg-[#0a0a0a] border-r border-white/5';
  }

  getTextClass(): string {
    return 'text-white';
  }

  getBorderClass(): string {
    return 'border-white/5';
  }

  getMenuActiveBtnClass(): string {
    return 'bg-t1-red text-white';
  }

  getMenuInactiveBtnClass(): string {
    return 'text-gray-500 hover:bg-white/5 hover:text-white';
  }

  getHeaderBgClass(): string {
    return 'bg-[#050505]/80 border-b border-white/5 backdrop-blur-md';
  }

  getCardBgClass(): string {
    return 'bg-[#0a0a0a] border border-white/5 hover:border-white/10 transition-all duration-300';
  }

  getCardTextClass(): string {
    return 'text-white';
  }

  getTextMutedClass(): string {
    return 'text-gray-500';
  }

  getHoverBgClass(): string {
    return 'hover:bg-white/[0.01]';
  }
}

// ─── 3. CREATOR ABSTRACT CLASS ─────────────────────────────────────────────
export abstract class ThemeCreator {
  /**
   * The Factory Method
   */
  public abstract createTheme(): ThemeProduct;

  /**
   * Operation using the Factory Method
   */
  public getTheme(): ThemeProduct {
    return this.createTheme();
  }
}

// ─── 4. CONCRETE CREATORS ────────────────────────────────────────────────────

/**
 * Concrete Creator for Light Theme
 */
export class LightThemeCreator extends ThemeCreator {
  public createTheme(): ThemeProduct {
    return new LightThemeProduct();
  }
}

/**
 * Concrete Creator for Dark Theme
 */
export class DarkThemeCreator extends ThemeCreator {
  public createTheme(): ThemeProduct {
    return new DarkThemeProduct();
  }
}

// ─── 5. FACTORY SELECTOR (Client Helper) ─────────────────────────────────────
export class ThemeFactorySelector {
  public static getCreator(mode: 'light' | 'dark'): ThemeCreator {
    if (mode === 'light') {
      return new LightThemeCreator();
    }
    return new DarkThemeCreator();
  }

  /**
   * Directly get the Theme Product (convenience method)
   */
  public static getTheme(mode: 'light' | 'dark'): ThemeProduct {
    return this.getCreator(mode).getTheme();
  }
}
