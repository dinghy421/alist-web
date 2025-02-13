import {
  Center,
  ElementType,
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
  MenuTriggerProps,
  Spinner,
  useColorModeValue,
} from "@hope-ui/solid"
import { useI18n } from "@solid-primitives/i18n"
import { createSignal, For, Show } from "solid-js"
import { langMap, languages, loadedLangs, setLang } from "~/app/i18n"
// import { TbLanguageHiragana } from "solid-icons/tb";
import { IoLanguageOutline } from "solid-icons/io"
import { Portal } from "solid-js/web"
import { useRouter } from "~/hooks"
import { FaSolidSailboat } from 'solid-icons/fa'
import { FiMail } from 'solid-icons/fi'
import { Button } from "@hope-ui/solid"


const [fetchingLang, setFetchingLang] = createSignal(false)

export const SwitchLanguage = <C extends ElementType = "button">(
  props: MenuTriggerProps<C>,
) => {
  const [, { locale, add }] = useI18n()
  const switchLang = async (lang: string) => {
    if (!loadedLangs.has(lang)) {
      setFetchingLang(true)
      add(lang, (await langMap[lang]()).default)
      setFetchingLang(false)
      loadedLangs.add(lang)
    }
    locale(lang)
    setLang(lang)
    localStorage.setItem("lang", lang)
  }
  return (
    <>
      <Menu>
        <MenuTrigger cursor="pointer" {...props} />
        <MenuContent>
          <For each={languages}>
            {(lang, i) => (
              <MenuItem
                onSelect={() => {
                  switchLang(lang.code)
                }}
              >
                {lang.lang}
              </MenuItem>
            )}
          </For>
        </MenuContent>
      </Menu>
      <Show when={fetchingLang()}>
        <Portal>
          <Center
            h="$full"
            w="$full"
            pos="fixed"
            top={0}
            bg={useColorModeValue("$blackAlpha4", "$whiteAlpha4")()}
            zIndex="9000"
          >
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="$neutral4"
              color="$info10"
              size="xl"
            />
          </Center>
        </Portal>
      </Show>
    </>
  )
}

export const SwitchLanguageWhite = () => (
  <SwitchLanguage as={IoLanguageOutline} boxSize="$8" />
)

export const DinghyHomepage = () => {
  return (
    <Button 
      onClick={() => window.location.href = "https://www.vyhd.xyz"} 
      boxSize="$8" 
      p="$2"
    >
      <FaSolidSailboat size="1.5em" />
    </Button>
  )
}

export const SendMeEmail = () => {
  return (
    <Button 
      onClick={() => window.location.href = "mailto:dinghyv@gmail.com"} 
      boxSize="$8" 
      p="$2"
    >
      <FiMail size="1.5em" />
    </Button>
  )
}
