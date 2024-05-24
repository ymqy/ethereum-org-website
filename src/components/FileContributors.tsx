import { useState } from "react"
import { useRouter } from "next/router"
import {
  Avatar,
  Flex,
  FlexProps,
  Heading,
  ListItem,
  ModalBody,
  ModalHeader,
  UnorderedList,
  VStack,
} from "@chakra-ui/react"

import type { ChildOnlyProp, FileContributor, Lang } from "@/lib/types"

import { Button } from "@/components/Buttons"
import InlineLink from "@/components/Link"
import Modal from "@/components/Modal"
import Text from "@/components/OldText"
import Translation from "@/components/Translation"

import { trackCustomEvent } from "@/lib/utils/matomo"
import { getLocaleTimestamp } from "@/lib/utils/time"

const ContributorList = ({ children }: Required<ChildOnlyProp>) => (
  <UnorderedList maxH="2xs" m={0} mt={6} overflowY="scroll">
    {children}
  </UnorderedList>
)

type ContributorProps = { contributor: FileContributor }
const Contributor = ({ contributor }: ContributorProps) => (
  <ListItem p={2} display="flex" alignItems="center">
    <Avatar
      height="40px"
      width="40px"
      src={contributor.avatar_url}
      name={contributor.login}
      me={2}
    />
    <InlineLink href={"https://github.com/" + contributor.login}>
      @{contributor.login}
    </InlineLink>
  </ListItem>
)

export type FileContributorsProps = FlexProps & {
  editPath?: string
  contributors: FileContributor[]
  lastEdit: string
}

const FileContributors = ({
  contributors,
  lastEdit,
  ...props
}: FileContributorsProps) => {
  const [isModalOpen, setModalOpen] = useState(false)
  const { locale } = useRouter()

  const lastContributor: FileContributor = contributors.length
    ? contributors[0]
    : ({
        avatar_url: "",
        login: "",
        html_url: "",
        date: Date.now().toString(),
      } as FileContributor)

  return (
    <>
      <Modal isOpen={isModalOpen} setIsOpen={setModalOpen}>
        <ModalHeader py={0}>
          <Heading m={0}>
            <Translation id="contributors" />
          </Heading>
        </ModalHeader>

        <ModalBody>
          <Translation id="contributors-thanks" />

          <ContributorList>
            {contributors.map((contributor) => (
              <Contributor contributor={contributor} key={contributor.login} />
            ))}
          </ContributorList>
        </ModalBody>
      </Modal>

      <Flex
        direction={{
          base: "column",
          md: "row",
        }}
        p={{ base: 0, md: 2 }}
        {...props}
      >
        <Flex me={4} alignItems="center" flex="1" hideBelow="md">
          <Avatar
            height="40px"
            width="40px"
            src={lastContributor.avatar_url}
            name={lastContributor.login}
            me={2}
          />

          <Text m={0} color="text200">
            <Translation id="last-edit" />:{" "}
            <InlineLink href={"https://github.com/" + lastContributor.login}>
              @{lastContributor.login}
            </InlineLink>
            , {getLocaleTimestamp(locale as Lang, lastEdit)}
          </Text>
        </Flex>

        <VStack align="stretch" justifyContent="space-between" spacing={2}>
          <Button
            variant="outline"
            bg="background.base"
            border={0}
            mb={{ base: 4, md: 0 }}
            onClick={() => {
              setModalOpen(true)
              trackCustomEvent({
                eventCategory: "see contributors",
                eventAction: "click",
                eventName: "click",
              })
            }}
            w={{ base: "full", md: "inherit" }}
          >
            <Translation id="see-contributors" />
          </Button>
        </VStack>
      </Flex>
    </>
  )
}

export default FileContributors
