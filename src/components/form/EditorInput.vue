<template>
  <div class="editor example">
    <editor-menu-bar :editor="editor"
                     v-slot="{ commands, isActive, getMarkAttrs, focused }">
      <div class="menubar " :class="{ 'is-focused': focused }">
        <button
            class="menubar__button"
            :class="{ 'is-active': isActive.bold() }"
            @click="commands.bold"
        >
          <icon name="bold"/>
        </button>

        <button
            class="menubar__button"
            :class="{ 'is-active': isActive.italic() }"
            @click="commands.italic"
        >
          <icon name="italic"/>
        </button>

        <button
            class="menubar__button"
            :class="{ 'is-active': isActive.strike() }"
            @click="commands.strike"
        >
          <icon name="strike"/>
        </button>

        <button
            class="menubar__button"
            :class="{ 'is-active': isActive.underline() }"
            @click="commands.underline"
        >
          <icon name="underline"/>
        </button>

        <button
            class="menubar__button"
            :class="{ 'is-active': isActive.code() }"
            @click="commands.code"
        >
          <icon name="code"/>
        </button>

        <button
            class="menubar__button"
            :class="{ 'is-active': isActive.paragraph() }"
            @click="commands.paragraph"
        >
          <icon name="paragraph"/>
        </button>

        <button
            class="menubar__button"
            :class="{ 'is-active': isActive.heading({ level: 1 }) }"
            @click="commands.heading({ level: 1 })"
        >
          H1
        </button>

        <button
            class="menubar__button"
            :class="{ 'is-active': isActive.heading({ level: 2 }) }"
            @click="commands.heading({ level: 2 })"
        >
          H2
        </button>

        <button
            class="menubar__button"
            :class="{ 'is-active': isActive.heading({ level: 3 }) }"
            @click="commands.heading({ level: 3 })"
        >
          H3
        </button>

        <button
            class="menubar__button"
            :class="{ 'is-active': isActive.bullet_list() }"
            @click="commands.bullet_list"
        >
          <icon name="ul"/>
        </button>

        <button
            class="menubar__button"
            :class="{ 'is-active': isActive.ordered_list() }"
            @click="commands.ordered_list"
        >
          <icon name="ol"/>
        </button>

        <button
            class="menubar__button"
            :class="{ 'is-active': isActive.blockquote() }"
            @click="commands.blockquote"
        >
          <icon name="quote"/>
        </button>

        <button
            class="menubar__button"
            :class="{ 'is-active': isActive.code_block() }"
            @click="commands.code_block"
        >
          <icon name="code"/>
        </button>


      </div>
    </editor-menu-bar>
    <editor-menu-bubble class="menububble" :editor="editor" @hide="hideLinkMenu"
                        v-slot="{ commands, isActive, getMarkAttrs, menu }">
      <div
          class="menububble"
          :class="{ 'is-active': menu.isActive }"
          :style="`left: ${menu.left}px; bottom: ${menu.bottom}px;`"
      >
        <form class="menububble__form" v-if="linkMenuIsActive" @submit.prevent="setLinkUrl(commands.link, linkUrl)">
          <input class="menububble__input" type="text" v-model="linkUrl" placeholder="https://" ref="linkInput"
                 @keydown.esc="hideLinkMenu"/>
          <button class="menububble__button" @click="setLinkUrl(commands.link, null)" type="button">
            <icon name="remove"/>
          </button>
        </form>

        <template v-else>
          <button
              class="menububble__button"
              @click="showLinkMenu(getMarkAttrs('link'))"
              :class="{ 'is-active': isActive.link() }"
          >
            <span>{{ isActive.link() ? 'Bağlantıyı Güncelle' : 'Bağlantı Ekle' }}</span>
            <icon name="link"/>
          </button>

        </template>
      </div>
    </editor-menu-bubble>

    <editor-content :content="val" ref="editor" class="editor__content" :editor="editor"/>
  </div>
</template>

<script>
import Icon from './EditorInputIcon'
import {Editor, EditorContent, EditorMenuBar, EditorMenuBubble} from 'tiptap'
import {
  Blockquote,
  Bold,
  BulletList,
  Code,
  CodeBlock,
  HardBreak,
  Heading,
  History,
  HorizontalRule,
  Italic,
  Link,
  ListItem,
  OrderedList,
  Strike,
  TodoItem,
  TodoList,
  Underline,
} from 'tiptap-extensions'

export default {
  components: {
    EditorContent,
    EditorMenuBubble,
    Icon,
    EditorMenuBar
  },
  props: {
    'value': {
      required: true,
      default: '',
    }
  },
  data() {
    return {
      fullscreen: false,
      keepInBounds: true,
      linkUrl: null,
      linkMenuIsActive: false,
      editor: new Editor({
        extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({levels: [1, 2, 3, 4, 5, 6]}),
          new HorizontalRule(),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Link(),
          new Bold(),
          new Code(),
          new Italic(),
          new Strike(),
          new Underline(),
          new History(),
        ],
        onUpdate: ({getHTML}) => {
          this.val = getHTML();
        },
      }),
    }
  },
  created() {
    setTimeout(() => {
      this.editor.setContent(this.val);
    })
  },
  beforeDestroy() {
    this.editor.destroy()
  },
  computed: {
    val: {
      set(value) {
        this.$emit('input', value)
      },
      get() {
        return this.value;
      },
    }
  },
  methods: {
    fullscreenChange(fullscreen) {
      this.fullscreen = fullscreen
    },
    showLinkMenu(attrs) {
      this.linkUrl = attrs.href
      this.linkMenuIsActive = true
      this.$nextTick(() => {
        this.$refs.linkInput.focus()
      })
    },
    hideLinkMenu() {
      this.linkUrl = null
      this.linkMenuIsActive = false
    },
    setLinkUrl(command, url) {
      command({href: url})
      this.hideLinkMenu()
    },
  },
}
</script>
<style>
.ProseMirror {
  min-height: 200px;
}

.menububble {
  position: absolute;
  display: flex;
  z-index: 20;
  background: #000000;
  border-radius: 5px;
  padding: 0.3rem;
  margin-bottom: 0.5rem;
  transform: translateX(-50%);
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.2s, visibility 0.2s;
}

.menububble.is-active {
  opacity: 1;
  visibility: visible;
}

.menububble__button {
  display: inline-flex;
  background: transparent;
  border: 0;
  color: #ffffff;
  padding: 0.2rem 0.5rem;
  margin-right: 0.2rem;
  border-radius: 3px;
  cursor: pointer;
}

.menububble__button:last-child {
  margin-right: 0;
}

.menububble__button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.menububble__button.is-active {
  background-color: rgba(255, 255, 255, 0.2);
}

.menububble__form {
  display: flex;
  align-items: center;
}

.menububble__input {
  font: inherit;
  border: none;
  background: transparent;
  color: #ffffff;
}

.menubar {
  margin-bottom: 1rem;
  transition: visibility 0.2s 0.4s, opacity 0.2s 0.4s;
  text-align: center;
}

.menubar.is-hidden {
  visibility: hidden;
  opacity: 0;
}

.menubar.is-focused {
  visibility: visible;
  opacity: 1;
  transition: visibility 0.2s, opacity 0.2s;
}

.menubar__button {
  font-weight: bold;
  display: inline-flex;
  background: transparent;
  border: 0;
  color: #222;
  padding: 0.2rem 0.45rem;
  margin-right: 0.2rem;
  border-radius: 3px;
  cursor: pointer;
}
.bg-dark .menubar__button{
  color:#FFF;
}
.bg-dark .menubar__button img{
  filter: invert(1);
}
.menubar__button:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.menubar__button.is-active {
  background-color: rgba(0, 0, 0, 0.1);
}

.menubar span.menubar__button {
  font-size: 13.3333px;
}

.button {
  font-weight: bold;
  display: inline-flex;
  background: transparent;
  border: 0;
  color: #000;
  padding: 0.2rem 0.5rem;
  margin-right: 0.2rem;
  border-radius: 3px;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.1);
}

.button:hover {
  background-color: rgba(0, 0, 0, 0.15);
}

.message {
  background-color: rgba(0, 0, 0, 0.05);
  color: rgba(0, 0, 0, 0.7);
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  font-style: italic;
}
.ProseMirror strong{
  font-weight: 700 !important;
}
.editor {
  position: relative;
  width: 100%;
  margin: 0 auto 0 auto;
  padding: 10px;
  border: 1px solid #DADADA;
  border-radius: 4px;
}

.editor__content {
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
}

.editor__content * {
  caret-color: currentColor;
}

.editor__content pre {
  padding: 0.7rem 1rem;
  border-radius: 5px;
  background: #000000;
  color: #ffffff;
  font-size: 0.8rem;
  overflow-x: auto;
}

.editor__content pre code {
  display: block;
}

.editor__content p code {
  padding: 0.2rem 0.4rem;
  border-radius: 5px;
  font-size: 0.8rem;
  font-weight: bold;
  background: rgba(0, 0, 0, 0.1);
  color: rgba(0, 0, 0, 0.8);
}

.editor__content ul,
.editor__content ol {
  padding-left: 1rem;
}

.editor__content li > p,
.editor__content li > ol,
.editor__content li > ul {
  margin: 0;
}

.editor__content a {
  color: inherit;
}

.editor__content blockquote {
  border-left: 3px solid rgba(0, 0, 0, 0.1);
  color: rgba(0, 0, 0, 0.8);
  padding-left: 0.8rem;
  font-style: italic;
}

.editor__content blockquote p {
  margin: 0;
}

.editor__content img {
  max-width: 100%;
  border-radius: 3px;
}

.editor__content table {
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
  margin: 0;
  overflow: hidden;
}

.editor__content table td, .editor__content table th {
  min-width: 1em;
  border: 2px solid #dddddd;
  padding: 3px 5px;
  vertical-align: top;
  box-sizing: border-box;
  position: relative;
}

.editor__content table td > *, .editor__content table th > * {
  margin-bottom: 0;
}

.editor__content table th {
  font-weight: bold;
  text-align: left;
}

.editor__content table .selectedCell:after {
  z-index: 2;
  position: absolute;
  content: "";
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(200, 200, 255, 0.4);
  pointer-events: none;
}

.editor__content table .column-resize-handle {
  position: absolute;
  right: -2px;
  top: 0;
  bottom: 0;
  width: 4px;
  z-index: 20;
  background-color: #adf;
  pointer-events: none;
}

.editor__content .tableWrapper {
  margin: 1em 0;
  overflow-x: auto;
}

.editor__content .resize-cursor {
  cursor: ew-resize;
  cursor: col-resize;
}
</style>