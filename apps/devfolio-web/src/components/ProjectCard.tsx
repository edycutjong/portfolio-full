"use client";

import {
  Carousel,
  Column,
  Flex,
  Heading,
  SmartLink,
  Text,
} from "@once-ui-system/core";

interface ProjectCardProps {
  href: string;
  priority?: boolean;
  images: string[];
  title: string;
  content: string;
  description: string;
  avatars: { src: string }[];
  link: string;
  reverse?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  href,
  images = [],
  title,
  content,
  description,
  link,
  reverse = false,
}) => {
  const imageSection = (
    <Flex flex={1} radius="l" style={{ overflow: "hidden", minWidth: 0 }}>
      <Carousel
        sizes="(max-width: 768px) 100vw, 500px"
        aspectRatio="16/9"
        items={images.map((image) => ({
          slide: image,
          alt: title,
        }))}
      />
    </Flex>
  );

  const contentSection = (
    <Column flex={1} gap="s" vertical="start" paddingX="m" paddingY="s">
      {title && (
        <Heading as="h2" wrap="balance" variant="heading-strong-l">
          {title}
        </Heading>
      )}
      {description?.trim() && (
        <Text
          wrap="balance"
          variant="body-default-m"
          onBackground="neutral-weak"
          style={{ maxWidth: "480px" }}
        >
          {description}
        </Text>
      )}
      <Flex gap="20" wrap vertical="center" style={{ marginTop: "var(--spacing-m)" }}>
        {content?.trim() && (
          <SmartLink
            href={href}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "var(--brand-on-background-strong)",
              textDecoration: "none"
            }}
          >
            <Text variant="label-default-s" style={{ color: "inherit" }}>Read case study</Text>
            <span style={{ fontSize: "14px" }}>→</span>
          </SmartLink>
        )}
        {link && (
          <SmartLink
            href={link}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "var(--neutral-on-background-medium)",
              textDecoration: "none"
            }}
          >
            <Text variant="label-default-s" style={{ color: "inherit" }}>View project</Text>
            <span style={{ fontSize: "14px" }}>↗</span>
          </SmartLink>
        )}
      </Flex>
    </Column>
  );

  return (
    <Flex
      fillWidth
      gap="l"
      paddingY="m"
      vertical="center"
      s={{ direction: "column" }}
      style={{ flexDirection: reverse ? "row-reverse" : "row" }}
    >
      {imageSection}
      {contentSection}
    </Flex>
  );
};
