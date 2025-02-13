import {
  HStack,
  useColorModeValue,
  Image,
  Center,
  Icon,
  Kbd,
  CenterProps,
} from "@hope-ui/solid"
import { changeColor } from "seemly"
import { Show, createMemo } from "solid-js"
import { getMainColor, getSetting, local, objStore, State } from "~/store"
import { BsSearch } from "solid-icons/bs"
import { CenterLoading } from "~/components"
import { Container } from "../Container"
import { bus } from "~/utils"
import { Layout } from "./layout"
import { isMac } from "~/utils/compatibility"
import { DinghyHomepage, SwitchLanguageWhite, SendMeEmail, UserLogin, UserAdmin } from "~/components"
import { UserMethods, User, UserRole } from "~/types/user"

// 假设你有一个函数 getCurrentUser 来获取当前用户
const getCurrentUser = (): User | null => {
  // 这里是获取当前用户的逻辑
  // 返回一个 User 对象或 null
  return {
    id: 1,
    username: "admin",
    password: "password",
    base_path: "/",
    role: UserRole.ADMIN,
    permission: 0,
    sso_id: "",
    disabled: false,
  }
}

export const Header = () => {
  const logos = getSetting("logo").split("\n")
  const logo = useColorModeValue(logos[0], logos.pop())

  const stickyProps = createMemo<CenterProps>(() => {
    switch (local["position_of_header_navbar"]) {
      case "sticky":
        return { position: "sticky", zIndex: "$sticky", top: 0 }
      default:
        return { position: undefined, zIndex: undefined, top: undefined }
    }
  })

  const currentUser = getCurrentUser()

  return (
    <Center
      {...stickyProps}
      bgColor="$background"
      class="header"
      w="$full"
      // shadow="$md"
    >
      <Container>
        <HStack
          px="calc(2% + 0.5rem)"
          py="$2"
          w="$full"
          justifyContent="space-between"
        >
          <HStack class="header-left" h="44px">
            <Image
              src={logo()!}
              h="$full"
              w="auto"
              fallback={<CenterLoading />}
            />
          </HStack>
          <HStack class="header-right" spacing="$2">
            <Show when={objStore.state === State.Folder}>
              <Show when={getSetting("search_index") !== "none"}>
                <HStack
                  bg="$neutral4"
                  w="$32"
                  p="$1"
                  rounded="$md"
                  justifyContent="space-between"
                  border="2px solid transparent"
                  cursor="pointer"
                  color={getMainColor()}
                  bgColor={changeColor(getMainColor(), { alpha: 0.15 })}
                  _hover={{
                    bgColor: changeColor(getMainColor(), { alpha: 0.2 }),
                  }}
                  onClick={() => {
                    bus.emit("tool", "search")
                  }}
                >
                  <Icon as={BsSearch} />
                  <HStack>
                    {isMac ? <Kbd>Cmd</Kbd> : <Kbd>Ctrl</Kbd>}
                    <Kbd>K</Kbd>
                  </HStack>
                </HStack>
              </Show>
              <DinghyHomepage />
              <SendMeEmail />
              <SwitchLanguageWhite />
              <Show when={currentUser && (UserMethods.is_admin(currentUser) || UserMethods.is_general(currentUser))}>
                <UserAdmin />
              </Show>
              <Show when={!currentUser || UserMethods.is_guest(currentUser)}>
                <UserLogin />
              </Show>
              <Layout />
            </Show>
          </HStack>
        </HStack>
      </Container>
    </Center>
  )
}