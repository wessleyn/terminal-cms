import { Box, Container, Flex, Paper, Skeleton } from "@mantine/core";

const AllMailsLoading = () => {
  return (
    <Container p={0} fluid>
      <Paper
        withBorder={false}
        p="md"
        px="lg"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.15)" }}
        radius="md">

        {/* FilterHeader Skeleton */}
        <Flex direction="column" gap="md" w="100%" mb="lg">
          <Flex gap="sm" wrap="wrap">
            {/* From selector */}
            <Skeleton height={36} radius="sm" width={160} />

            {/* Date range selector */}
            <Skeleton height={36} radius="sm" width={140} />

            {/* Has attachment button */}
            <Skeleton height={36} radius="sm" width={130} />

            {/* To selector */}
            <Skeleton height={36} radius="sm" width={160} />

            {/* Is unread button */}
            <Skeleton height={36} radius="sm" width={110} />
          </Flex>
        </Flex>

        {/* EmailSelector Skeleton */}
        <Flex gap='lg' w={'100%'} justify={'space-between'} align="center" mb="md">
          <Flex gap='lg' align="center">
            {/* Selection menu */}
            <Skeleton height={24} width={24} radius="sm" />

            {/* Action buttons */}
            <Flex gap="xs">
              <Skeleton height={24} width={24} radius="sm" />
              <Skeleton height={24} width={24} radius="sm" />
              <Skeleton height={24} width={24} radius="sm" />
              <Skeleton height={24} width={24} radius="sm" />
              <Skeleton height={24} width={24} radius="sm" />
            </Flex>

            {/* More options menu */}
            <Skeleton height={24} width={24} radius="sm" />
          </Flex>

          {/* Pagination controls */}
          <Flex gap="xs" align="center">
            <Skeleton height={24} width={24} radius="sm" />
            <Skeleton height={20} width={40} radius="sm" />
            <Skeleton height={24} width={24} radius="sm" />
          </Flex>
        </Flex>

        {/* EmailList Skeleton */}
        <Box mt="md">
          <Flex direction="column" gap="xs">
            {/* Generate 10 email skeletons */}
            {Array.from({ length: 10 }).map((_, index) => (
              <Flex key={index} align="center" gap={8}>
                {/* Checkbox */}
                <Skeleton height={20} width={20} radius="sm" />

                <Paper
                  shadow="xs"
                  p="md"
                  w={'100%'}
                  style={{
                    cursor: 'pointer',
                    borderRadius: 8,
                    backgroundColor: index % 3 === 0 ? 'rgba(0, 0, 0, 0.3)' : undefined // Every third row darker to simulate unread
                  }}
                >
                  <Flex gap="md" align="center">
                    {/* Avatar */}
                    <Skeleton height={40} width={40} radius="xl" />

                    <Box style={{ flex: 1 }}>
                      <Flex align="center">
                        {/* Sender name */}
                        <Box w={300} mr="md">
                          <Skeleton height={16} width="80%" mb={4} />
                        </Box>

                        {/* Email subject and preview */}
                        <Box style={{ flex: 1 }} mr="md">
                          <Skeleton height={16} width="95%" mb={8} />
                          <Flex gap="xs" align="center">
                            {/* Icons for starred, attachment, etc */}
                            {index % 4 === 0 && <Skeleton height={14} width={14} radius="xl" />}
                            {index % 5 === 0 && <Skeleton height={14} width={14} radius="xl" />}
                            <Skeleton height={12} width="70%" />
                          </Flex>
                        </Box>

                        {/* Time */}
                        <Box w={60} ta="right">
                          <Skeleton height={12} width={40} />
                        </Box>
                      </Flex>
                    </Box>
                  </Flex>
                </Paper>
              </Flex>
            ))}
          </Flex>
        </Box>

        {/* Empty state placeholder is commented out but ready if needed 
        <Box my="xl" py="xl" ta="center">
          <Skeleton height={50} width={50} radius="xl" mx="auto" mb="md" />
          <Skeleton height={24} width={200} radius="sm" mx="auto" mb="sm" />
          <Skeleton height={16} width={300} radius="sm" mx="auto" />
        </Box>
        */}
      </Paper>
    </Container>
  )
}

export default AllMailsLoading