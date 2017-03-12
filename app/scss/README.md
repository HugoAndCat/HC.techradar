#Sass Source files

##Coding Style

Influenced by the following modular CSS methodologies:

- SMACCS: Scaleable, Modular, Architecture CSS https://smacss.com/book
- BEM: Block, Element, Modifier http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/
- Atomic design: http://bradfrost.com/blog/post/atomic-web-design/

###Syntax

SMACCS - use classnames to style, never ids and only elements if absolutely necessary.

BEM - We have found the BEM syntax to be verbose. For this reason we have opted to use a similar methodology with a simpler syntax. Here we keep the idea of block, element, modifier, but instead of preceeding the modifier with the block name, we just define the modifier class within the SCSS module.

Use hyphens `-` for multi-word classnames. such as

    .md-rich-text

Use underscores `_` for elements contained within the block such as

    .md-rich-text_text

Add a modifier to a block by adding a new class

    .rich-text {
        &.collapsed {
            // collapsed state attributes
        }
    }

or 

    .rich-text.color-red


##Layout Templates

Layout templates are defined as such:

    .one-col,
    .two-col,
    .three-col

Layouts appear as `<section>`s within the site. 
Each layout has a number of `<div class="container" />` corresponding to the number of columns within that layout. 

Each module element is then injected into the container element contained within the layout. 

As such:

    <section class="two-col">
        <div class="container">
            <div class="rich-text"></div>
        </div>
        <div class="container">
            <div class="rich-text"></div>
        </div>
    </section>

##SASS rulez


- Never style by ID

- Do not to style by element selector - eg `header {}` - always use classnames.

- It is only OK to style by elements if they are global for instance for typography, but even then this should be limited.

- Only nest 3 levels deep!

- Multiiple classes should be placed above each other

    .classname-one,
    .classname-two {
        // your content
    }